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
        var hashing = require('password-hash');
        var userID;
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        //Using Sha1 algo for hashing and 16 byte long salt with 8 iterations
        var PWHash = hashing.generate(password, sha1, 16, 8);
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
    updateUserData:function (UserID,json)
    {
        //to interface with the DB to update user's data
    }



};