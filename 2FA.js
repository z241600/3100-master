/**
 * Created by user on 09-Apr-17.
 */
module.exports = {


    //generate a new code for user if they don't have 2FA active, otherwise
    //display the page that allow users to disable 2FA.
    generate2FAToken: function (res,UserId,req){
        var speakeasy = require('speakeasy');
        var secret = speakeasy.generateSecret({length: 20});
        var session = require('express-session');
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql = "SELECT TwoFactorAuth FROM userlogindata WHERE UserId="+UserId.toString() ;
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }
            console.log(results);
            var secerte = results[0]['TwoFactorAuth'];
            if (secerte == "") {
                secret = speakeasy.generateSecret({length: 20});
                console.log(secret.base32); // secret of length 20
                console.log(UserId);
                returnVar = {'url': secret.otpauth_url, 'secretTxt': secret.base32, userId: UserId};
                returnVar['userName'] = req.session.userName;
                res.render('2FA', returnVar);
            }
            else {
                res.render('disable2FA', {userId:UserId,userName:req.session.userName});
            }
        });

    },
    // to verify the secrete provided with the 2FA token
    //used to verify that the user have set up the app correctly teh first time.
    verify2FASecrete: function (res,token,secerte,req) {
        var speakeasy = require('speakeasy');
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var verified = speakeasy.totp.verify({
            secret: secerte,
            encoding: 'base32',
            token: token
        });
        console.log(token);
        console.log(secerte);
        console.log(verified);

        if(verified){
            UserID = req.session.userId;
            console.log(UserID);
            var sql = "UPDATE UserLoginData SET TwoFactorAuth='"+secerte+"' WHERE UserID="+UserID.toString() ;
            console.log(sql);
            connection.query(sql, function (error, results) {

                if (error) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    returnVar = {'return':0};
                    res.end(JSON.stringify(returnVar));
                    return console.error(error);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                returnVar = {'return':1};
                res.end(JSON.stringify(returnVar));
            });

        }
        else
        {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            returnVar = {'return':0};
            res.end(JSON.stringify(returnVar));
        }
       // res.end(JSON.stringify(returnVar));
    },
    //to verify a user with provided 2FA token
    verify2FAToken:function(userID,token,res,callback){
        var speakeasy = require('speakeasy');
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql = "SELECT TwoFactorAuth FROM userlogindata WHERE UserId="+userID.toString() ;
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }
            console.log(results);
            var secerte = results[0]['TwoFactorAuth'];
            var verified = speakeasy.totp.verify({
                secret: secerte,
                encoding: 'base32',
                token: token
            });
            callback(res,verified);
        });
    },
    disable2FA:function(userID,res){
        var mysql = require("mysql");
        console.log (userID);
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "UPDATE userlogindata SET TwoFactorAuth = ''  WHERE UserId="+userID.toString() ;
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                consloe.log(error);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                returnVar = {'return':0};
                res.end(JSON.stringify(returnVar));
                return console.error(error);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            returnVar = {'return':1};
            res.end(JSON.stringify(returnVar));
            console.log(results);


            });



    }
};
