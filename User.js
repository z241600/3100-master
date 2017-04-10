/**
 * Created by user on 20-Mar-17.
 */
module.exports = {

    checkUserDup: function (userName,res) {

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

    CreateUser:function (res,UserName,password,FirstName,LastName,Addr,TelNo,Email,Location){
        var he =  require("he");
        var mysql = require("mysql");
        var scrypt = require('scrypt');
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
        PWHah=PWHash.toString("hex");

        FirstName = he.encode(FirstName);
        LastName = he.encode(LastName);
        Addr = he.encode(Addr);
        TelNo = he.encode(TelNo);
        Location = he.encode(Location);
        var sql = "INSERT INTO userlogindata (userName,PWHash) VALUES ('"+UserName+"','"+PWHash+"')";
        connection.query(sql, function (error, results) {});
        console.log(sql);
        sql = "SELECT UserId FROM userlogindata WHERE userName='"+UserName+"'";
        console.log(sql);
        connection.query(sql, function (error, results) {
            userID = results[0]['UserId'];
            var sql2 = "INSERT INTO userdata (UserID,FirstName,LastName,Addr,TelNo,Location) VALUES ("+userID.toString()+",'"+FirstName+"','"+LastName+"','"+Addr+"','"+TelNo+"','"+Location+"')";
            console.log(sql2);
            connection.query(sql2, function (error, results) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                if (error) {
                    console.log("UserData failed");
                    console.log(error);
                    returnVar = {'return':0};

                }else{
                    console.log("UserData successful");
                    returnVar = {'return':1};
                }
                res.end(JSON.stringify(returnVar));
                return returnVar;
                //res.render('signup', {});
            });
        });


    },

    LoginUser:function (res,UserName_input,password_input){
        var he =  require("he");
        var mysql = require("mysql");
        var scrypt = require("scrypt");
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
        sql = "SELECT UserId,PWHash FROM userlogindata WHERE userName='"+UserName_input+"'";
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error){
                //the userID does not exist
            }
            var scryptParameters = scrypt.paramsSync(0.1);
            userID = results[0]['UserId'];
            userPWHash  = results[0]['PWHash'];
            if (scrypt.verifyKdfSync(userPWHash, password_input)===true){
                //login success

            }else{
                //login fail

            }
        });

    },


    updateUserData:function (UserID,json)
    {
        //to interface with the DB to update user's data
    }



};