/**
 * Created by user on 23-Mar-17.
 */
module.exports = {


    SendAuthEmail: function (Email,userID) {

        //send email to user to verify the email address
        var nodemailer = require('nodemailer');

        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        //var hex = token.toString('hex');
        var crypto = require('crypto');

        const buff =  crypto.randomBytes(10);

        const token = buff.toString('hex');

        console.log(token);

        var htmltemplate = "<p>Please click the following link to verify your email address. This link is one-time use only</p> <a href>";

        htmltemplate += "localhost:3000/" + token+ "</a>";

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

        const Acctype = "NoAuth";
        var sql = "UPDATE userdata SET 'AccType' = '"+Acctype+"' 'AuthToken' = '"+token+"' WHERE UserID="+userID;

        connection.query(sql, function (error, results) {
            if (error){
                //console.log(error.toString());
            }
                console.log("Saved Acctype and AuthToken");
        });
    },
    AuthEmailToken: function (UserID, Token) {
        //Authendicate user with the provided token, and activating the user's account

    }
};

