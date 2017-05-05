/**
 * Created by user on 20-Mar-17.
 */
module.exports = {

    checkUserDup: function (userName,res) {
        // check for duplicates of user name during sign-up.
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT UserId FROM userlogindata WHERE userName='"+userName+"'";
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }


            res.writeHead(200, { 'Content-Type': 'application/json' });

            if (!Object.keys( results).length)
            {
                returnVar = {'UserId':-1};
            }
            else{
                returnVar = results[0];
            }

            res.end(JSON.stringify(returnVar));

            return returnVar;
        });
    },
    checkEmailDup: function (userName,res) {
    // check for duplicates of email during sign-up.
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT Email FROM userlogindata WHERE Email='"+userName+"'";
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }


            res.writeHead(200, { 'Content-Type': 'application/json' });
            console.log(results);
            if (!Object.keys( results).length)
            {
                returnVar = {'Email':-1};

            }
            else{

                returnVar = results[0];
            }
            res.end(JSON.stringify(returnVar));

            return returnVar;
        });
    },

    CreateUser:function (res,UserName,password,FirstName,LastName,Addr,TelNo,Email,Location,PaypalMeLink,PaypalName){
        //create user record using user provided data.
        var he =  require("he");
        var mysql = require("mysql");
        var email = require("./Email");

        var scrypt = require("scrypt");

        var userID;
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var scryptParameters = scrypt.paramsSync(0.1);
        try {
            var PWHash = scrypt.kdfSync(password, scryptParameters);
        }catch(err){
            console.log(err);
        }

        var PWHashString=PWHash.toString("hex");

        FirstName = he.encode(FirstName);
        LastName = he.encode(LastName);
        Addr = he.encode(Addr);
        TelNo = he.encode(TelNo);
        Location = he.encode(Location);
        PaypalMeLink = he.encode(PaypalMeLink);
        PaypalName = he.encode(PaypalName);
        var sql = "INSERT INTO userlogindata (userName,PWHash,Email,AccType,TwoFactorAuth) VALUES ('"+UserName+"','"+PWHashString+"','"+Email+"','V','')";
        console.log(sql);
        connection.query(sql, function (error, results) {
            if(error){
                console.log(error);
            }
        });
        console.log(sql);
        sql = "SELECT UserId FROM userlogindata WHERE userName='"+UserName+"'";
        console.log(sql);
        connection.query(sql, function (error, results) {
            userID = results[0]['UserId'];
            var sql2 = "INSERT INTO userdata (UserID,FirstName,LastName,Addr,TelNo,Location,PaypalMeLink,PaypalName) VALUES ("+userID.toString()+",'"+FirstName+"','"+LastName+"','"+Addr+"','"+TelNo+"','"+Location+"','"+PaypalMeLink+"','"+PaypalName+"')";
            console.log(sql2);
            connection.query(sql2, function (error, results) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                if (error) {
                    console.log("UserData failed");
                    console.log(error);
                    returnVar = {'return':0};
                    res.end(JSON.stringify(returnVar));

                }else{

                    console.log("UserData successful");

                    email.SendAuthEmail(Email,userID,res,function (res) {
                        returnVar = {'return':1};
                        res.end(JSON.stringify(returnVar));
                    })
                }

                return 0;
                //res.render('signup', {});
            });
        });


    },

    LoginUser:function (res,UserName_input,password_input,req){
        //authendicate user with provided username and password.
        //if it is correct but no 2FA active, log user in.
        //if it is correct with 2FA active, redir user to 2FA page..
        //if password is valid,
        var he =  require("he");
        var mysql = require("mysql");
        var scrypt = require("scrypt");

      var session = require("./session");


        var session = require("./session");

        var userID;
        var userPWHash;
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });


        //Using sha1 algo for hashing and 16 byte long salt with 8 iterations
        if(  !UserName_input || !password_input)
        {
            res.render("messageRedir",{head:"login failed!",top:"Sorry!",lower:"redirecting you to our login page..",redir:"./login",background:"red"})
            return 0;
        }
        //Using sha1 algo for hashing and 16 byte long salt with 8 iterations
        sql = "SELECT UserId,PWHash,AccType,TwoFactorAuth FROM userlogindata WHERE Email='"+UserName_input+"'";

        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error){
                console.log(error);
                //the userID does not exist
                res.writeHead(200, { 'Content-Type': 'application/json' });
                returnVar = {'return':0};
                res.end(JSON.stringify(returnVar));
                return null;
            }
            console.log(results.keys().length);
            if(results.keys().length<=0)
            {
                res.render("messageRedir",{head:"login failed!",top:"Sorry!",lower:"redirecting you to our login page..",redir:"./login",background:"red"})
                return 0;
            }
            if(results[0]['AccType']=='V')
            {
                res.render("messageRedir",{head:"Sorry!",top:"Please verify your email first!",lower:"redirecting you to our login page..",redir:"./login",background:"red"})
                return 0;
            }
            if(results[0]['AccType']=='B')
            {
                res.render("messageRedir",{head:"Sorry!",top:"You are banned from using this dite.",lower:"redirecting you to our home page..",redir:"../",background:"red"})
                return 0;
            }
            userID = results[0]['UserId'];
            userPWHash  = results[0]['PWHash'];

            if (scrypt.verifyKdfSync(new Buffer(userPWHash,'hex'), password_input)===true){

                //login success
                if(results[0]['TwoFactorAuth']=="")
                {
                    session.createSession(req,userID,res);
                }
                else
                {
                    ssn = req.session;
                    ssn.userName =  results[0]['userName'];
                    ssn.userId = userID;
                    ssn.TwoFAToken = results[0]['TwoFactorAuth'];
                    ssn.redirectTo ="login";
                    res.render("messageRedir",{head:"Two Factor Authendication detected!",top:"",lower:"redirecting ...",redir:"./inputTwoFactorToken",background:"yellow"});
                }
               // returnVar = {'return':1};
            }else{
              //  returnVar = {'return':0};
                //login fail

                res.render("messageRedir",{head:"login failed!",top:"Sorry!",lower:"redirecting you to our login page..",redir:"./login",background:"red"});
                return 0;

            }
           // res.end(JSON.stringify(returnVar));
        });

    },



    updateUserData:function (res,req){
        //get the user's data, for editing the user's data use.
        var mysql = require("mysql");
        var he = require("he");
        var session = require('express-session');
        userID = req.session.userId;

        sql = "SELECT * FROM userdata WHERE UserID='"+userID+"'";
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        console.log(sql);
        connection.query(sql, function (error, results) {
            if(error)
            {
                return 0;
            }
            else
            {
                FirstNameVar = results[0]['FirstName'];
                LastNameVar = results[0]['LastName'];
                AddrVar = results[0]['Addr'];
                TelNoVar = results[0]['TelNo'];
                LocationVar = results[0]['Location'];
                PaypalMeLinkVar = results[0]['PaypalMeLink'];
                returnVar = {FirstName:FirstNameVar,LastName:LastNameVar,Addr:AddrVar,TelNo:TelNoVar,
                    Location:LocationVar,PaypalMeLink:PaypalMeLinkVar,UserId:userID,userName:req.session.userName};

                res.render('updateUserData', returnVar);
            }

        });

    },
    updateUserDataAction:function(FirstName,LastName,Addr,TelNo,Location,PaypalMeLink,UserId,res,req){
        //with provided data, modify the user's data.
        var mysql = require("mysql");
        var he = require("he");
        //var session = require('express-session');
        FirstName = he.encode(FirstName);
        LastName = he.encode(LastName);
        Addr = he.encode(Addr);
        TelNo = he.encode(TelNo);
        Location = he.encode(Location);
        sql ="UPDATE userdata SET LastName = '"+LastName+"', FirstName =  '"+FirstName+"', Addr = '"+Addr+"', TelNo = '"+TelNo+"', Location = '"+Location+"', PaypalMeLink ='"+PaypalMeLink+"'WHERE UserID = "+UserId;
        console.log(sql);
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        //console.log(sql);
        connection.query(sql, function (error, results) {
        if(error)
        {
            console.log(error);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            returnVar = {'return':0};
            res.end(JSON.stringify(returnVar));
        }
        else{
            res.writeHead(200, { 'Content-Type': 'application/json' });
            returnVar = {'return':1};
            res.end(JSON.stringify(returnVar));
        }
        });



    },
    LogoutUser:function(res,req) {
        //logout the user, destroy the session.
        var session = require('express-session');
        req.session.destroy();
        res.render("messageRedir",{head:"Logout successful!",top:"bye!",lower:"We wish seeing you again!",redir:"../",background:"green"});
    },
    getLoggedData:function(res,req,returnVar,callbackl)
    {
        //NOT USED
        var session = require('express-session');
        returnVar['userName'] =req.session.userName;
        return returnVar;
    }

};