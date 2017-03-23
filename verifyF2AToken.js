/**
 * Created by user on 21-Mar-17.
 */
module.exports = {

    init: function (res,token,secerte) {
        var speakeasy = require('speakeasy');

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
        }
        else
        {
            returnVar = {'return':0};
        }
        res.end(JSON.stringify(returnVar));
    }
};