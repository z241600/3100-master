/**
 * Created by user on 23-Mar-17.
 */
module.exports = {


    SendAuthEmail: function (Email,userID,res,callback) {

        //send email to user to verify the email address
        var nodemailer = require('nodemailer');

        var mysql = require("mysql");

        //var hex = token.toString('hex');
        var crypto = require('crypto');

        const buff =  crypto.randomBytes(10);

        const token = buff.toString('hex');

        console.log(token);

        var htmltemplate = "<p>Please click the following link to verify your email address. This link is one-time use only</p><br> <a href='";

        htmltemplate += "http://localhost:3000/verifyEmailToken?token=" + token + "&userID=" + userID + "'>Click Here:</a>" ;

        console.log(htmltemplate);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'csci3100proj@gmail.com',
                pass: 'lb5db4wr'
            }
        });

        var mailOptions = {
            from: '"Please Do not reply to this verification email" <noreply_1stopshop@csci3100.com>',
            to: Email,
            subject: 'Verification Email from 1StopShop',
            text: 'Please click the following link to verify your email address. This link is one-time use only',
            html: htmltemplate

        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });


        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        const Acctype = 'V';
        var sql = "UPDATE userlogindata SET AccType = '"+Acctype+"', AuthToken = '"+token+"' WHERE UserID="+userID;

        connection.query(sql, function (error, results) {
            if (error){
                return console.log(error.toString());
            }
                callback(res);
                console.log("Saved Acctype and AuthToken");
        });
    },
    AuthEmailToken: function (userID, Token,res) {
        //Authendicate user with the provided token, and activating the user's account

        var mysql = require("mysql");
        var he =  require("he");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        console.log(userID);
        var sql = "SELECT UserId,AuthToken FROM userlogindata WHERE UserID="+userID;
        connection.query(sql, function (error, results) {
            if (error){
                return console.log(error.toString());
            }
            //userID = results[0]['UserId'];
            AuthToken  = results[0]['AuthToken'];
            Acctype = 'N';
            buf = "-1";
            if (AuthToken === Token){
                console.log("Verified %s", userID);
                var sql2 = "UPDATE userlogindata SET AccType = '"+Acctype+"',AuthToken = '"+buf+"' WHERE UserID="+userID;
                connection.query(sql2, function (error, results) {
                    if (error){
                        return console.log(error.toString());
                    }
                    console.log("UPDATED %s", userID);
                    res.render("messageRedir",{head:"Verified successfully!",top:"Your email have been verified.",lower:"You can now join our many users to enjoy our features! Redirecting to homepage...",background:"green",redir:"../"});
                });
            }else{
                console.log("WRONG Token");
                //throw error here
            }
        });

    }
};

