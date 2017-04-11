/**
 * Created by user on 08-Apr-17.
 */
module.exports = {

    checkSession: function (req,res, callback) {
        var session = require('express-session');
        var sessionID = req.sessionID;
        var userID = req.session.userId;
        if(userID==null){

            console.log("userID is null!");
            callback(res,0,req);
            return 0;
        }
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql = "SELECT SessionData FROM userlogindata WHERE UserId="+userID;
       // console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }

            if(results[0]['SessionData']==sessionID)
            {
                header ="";
            }
            else
            {

            }
                callback(res,results[0]['SessionData']==sessionID,req);

        });


    },

    createSession:function(req,userID, res) {
        var session = require('express-session');
        var sessionID = req.sessionID;
        var sess=req.session;
        var mysql = require("mysql");
        var user = require("./user");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql = "UPDATE userlogindata SET SessionData='" + sessionID + "' WHERE UserId = " + userID.toString();
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {

                return 0;
            }
            else {
                var sql1 = "SELECT userName FROM userlogindata WHERE UserId = " + userID.toString();
                console.log(sql1);
                connection.query(sql1, function (error, results) {
                    ssn = req.session;
                    ssn.userName =  results[0]['userName'];
                    ssn.userId = userID;
                    console.log(ssn.userId);
                    console.log(ssn.userName);
                    console.log(req.sessionID);
                    //callback(res);
                   // return 1;
                    var returnVar = {head:"Logged in Successfully!",top:"Welcome!",lower:"Redirecting You to our homepage...",redir:"../",background:"green"}
                    returnVar = user.getLoggedData(res,req,returnVar);
                    res.render("messageRedirLogged",returnVar);
                });


            }
        });
    }
};