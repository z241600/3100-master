/**
 * Created by user on 21-Mar-17.
 */
module.exports = {

    init: function (res,token,secerte) {
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
            var UserID=0;
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
    }
};