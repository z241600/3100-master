/**
 * Created by user on 23-Mar-17.
 */
module.exports = {
    sendPM:function(res,req,senderID,receipentID,content)
    {
        var mysql = require("mysql");
        var he = require("he");
        var async = require("async");
        var session = require("express-session");
        var sess = require("./session");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        content = he.encode(content);
        var sql = "INSERT INTO privatemsg (SenderID,ReceiverID,MsgContent) VALUES ("+senderID+","+receipentID+",'"+content+"')";
        connection.query(sql, function (error, results) {
            if(error){
                res.writeHead(200, { 'Content-Type': 'application/json' });
                returnVar = {'return':0};
                res.end(JSON.stringify(returnVar));
                console.log(error);
            }else
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                returnVar = {'return':1};
                res.end(JSON.stringify(returnVar));
            }
        });

        //Send private message to another user
    },
    retrievePM:function(res,req,count){
        //Receive private message from mailbox
        var mysql = require("mysql");
        var he = require("he");
        var async = require("async");
        var session = require("express-session");
        var sess = require("./session");
        userID = req.session.userId;
        sql = "SELECT * FROM privatemsg WHERE ReceiverID="+userID+" OR SenderID ="+userID;
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        console.log(sql);
        htmlString="";
        MessageArray = [];

        async.waterfall([
            function(callbackMain) {

                connection.query(sql, function (error, results) {
                    if (results.length <= 0) {
                        htmlString = "<h2>You don't have any message!</h2>"
                    }
                    async.each(results,function (Entry,callback) {
                        MessageArray[Entry['MsgID']] = Entry;
                        callback();
                    }, function (err) {
                        console.log(MessageArray);
                        callbackMain();
                    });

                });
            }, function (callback3) {

                async.each(MessageArray, function (msgEntry, callbackEach) {
                    if(msgEntry) {

                        if(msgEntry['ReceiverID']==req.session.userId) {
                           // console.log("RECEIVING MESSAGE");
                            var sql4 = "SELECT userName FROM userlogindata WHERE UserID=" + msgEntry['SenderID'];
                            console.log(sql4);
                            connection.query(sql4, function (error, results) {
                                console.log(results);
                                MessageArray[msgEntry['MsgID']]['SenderName'] = results[0]['userName'];

                                callbackEach();
                            });
                        }
                        else
                        {
                           // console.log("SENDING MESSAGE");
                            var sql4 = "SELECT userName FROM userlogindata WHERE UserID=" + msgEntry['ReceiverID'];
                            console.log(sql4);
                            connection.query(sql4, function (error, results) {
                                console.log(results);
                                MessageArray[msgEntry['MsgID']]['ReceiverName'] = results[0]['userName'];

                                callbackEach();
                            });
                        }
                    }
                    else
                    {
                        callbackEach();
                    }


                },function (err) {
                    callback3();
                });

            }, function (callback2) {
                async.each(MessageArray, function (msgEntry, callbackEach) {
               //     console.log(msgEntry);

                    if (msgEntry) {
                      //  console.log(req.session.userId==msgEntry['ReceiverID']);
                      //  console.log(req.session.userId==msgEntry['SenderID']);
                        if(req.session.userId==msgEntry['ReceiverID'])
                        {
                            console.log("RECEIVING MESSAGE");
                            htmlString+="<div class='text-left'>";
                            htmlString+=msgEntry['MsgContent'];
                            htmlString+="<br>on "+msgEntry['SentDate']+" From "+msgEntry['SenderName']+"</div><hr>";
                            callbackEach();
                        }
                        if(req.session.userId==msgEntry['SenderID'])
                        {
                            console.log("SENDING MESSAGE");
                            htmlString+="<div class='text-right'>";
                            htmlString+=msgEntry['MsgContent'];
                            htmlString+="<br>on "+msgEntry['SentDate']+" to "+msgEntry['ReceiverName']+"</div><hr>";
                            callbackEach();
                        }

                    }
                    else {
                        callbackEach();
                    }
                }, function (err) {
                    callback2()
                });

            },function(err)
            {
                res.render("sendMessage",{html:htmlString , userName:req.session.userName,userId:req.session.userId});
            }
        ]);

    },
    checkUnreadMessage:function(userID)
    {
        //return number of unread message
    }

};