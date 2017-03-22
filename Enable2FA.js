/**
 * Created by user on 21-Mar-17.
 */
module.exports = {

    init: function (res,UserId){
        var speakeasy = require('speakeasy');
        var secret = speakeasy.generateSecret({length: 20});
        console.log(secret.base32); // secret of length 20
        returnVar = {'url':secret.otpauth_url,'secretTxt':secret.base32};
        res.render('2FA',returnVar);

    }
}
