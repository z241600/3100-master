/**
 * Created by user on 23-Mar-17.
 */
module.exports = {


    SendAuthEmail: function (Email) {

        //send email to user to verify the email address
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'csci3100proj@gmail.com',
                pass: 'lb5db4wr'
            }
        });

        var mailOptions = {
            from: '"This Pile of Shit 👻" <noreply_shity@csci3100.com>',
            to: Email,
            subject: 'Verification Email from CSCI3100 💩',
            text: 'Please click the following link to verify your email address.\n',
            html: '<a href>www.google.com</a>'

        };

        ransporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });

    },
    AuthEmailToken: function (UserID, Token) {
        //Authendicate user with the provided token, and activating the user's account

    }
};

