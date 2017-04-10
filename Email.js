/**
 * Created by user on 23-Mar-17.
 */
module.exports = {


    SendAuthEmail: function (Email) {

        //send email to user to verify the email address
       /* var crypto = require('crypto');
        crypto.randomBytes(sql, function (error, results) {
            if (error){
                //the userID does not exist
            }
            userID = results[0]['UserId'];
            userPWHash  = results[0]['PWHash'];
            if (hashing.verify(password_input, userPWHash)===true){
                //login success

            }else{
                //login fail
            }
        });
       */

    },
    AuthEmailToken: function (UserID, Token) {
        //Authendicate user with the provided token, and activating the user's account

    }
};

