/**
 * Created by user on 09-Apr-17.
 */
module.exports = {

    generate2FAToken: function (res,UserId){
        var speakeasy = require('speakeasy');
        var secret = speakeasy.generateSecret({length: 20});
        console.log(secret.base32); // secret of length 20
        returnVar = {'url':secret.otpauth_url,'secretTxt':secret.base32};
        res.render('2FA',returnVar);
    },
    verify2FASecrete: function (res,token,secerte) {
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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if(verified){
            returnVar = {'return':1};
            //WAITING FOR LOGIN?SESSION TO BE FINISHED
            var UserID=1;
            var sql = "UPDATE UserLoginData SET TwoFactorAuth='"+secerte+"' WHERE UserID="+UserID.toString() ;
            console.log(sql);
            connection.query(sql, function (error, results) {
                if (error) {
                    return console.error(error);
                }
            });

        }
        else
        {
            returnVar = {'return':0};
        }
        res.end(JSON.stringify(returnVar));
    },verify2FAToken:function(userID,token){
        var speakeasy = require('speakeasy');
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql = "SELECT TwoFactorAuth FROM UserLoginData WHERE UserID="+UserID.toString() ;
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }
            var secerte = results[0];
            var verified = speakeasy.totp.verify({
                secret: secerte,
                encoding: 'base32',
                token: token
            });
            if (verified){
                return 1;
            }else
            {
                return 0;
            }
        });
    }
}
