/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    paypalAuthCodeCallback:function(){
        //Callback function for getting user Authorization code after logging in through paypal
    },
    exchangePaypalToken:function(AuthCode){
        //Send Auth Token to exchange for JSON with access_token, refresh_token, and id_token
    },
    getPaypalUserName:function(AccessToken){
        //Get user name from Paypal User Profile Service

    }


};