/**
 * Created by user on 12-Apr-17.
 */
module.exports = {


    // to insert the comment into the database with item id as a refrence when getting the item out of the database
    postMainComment:function(UserId,cmtMsg,itemId,req,res)
    {
        var he = require('he');
        var mysql = require('mysql');
        cmtMsg = he.encode(cmtMsg);

        var connectionItem = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        var sql="INSERT INTO itemcmt (ItemID,MsgContent,PosterID) VALUES ("+itemId+",'"+cmtMsg+"',"+UserId+")";
        connectionItem.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                res.writeHead(200, {'Content-Type': 'application/json'});
                returnVar = {'return': 0};
                res.end(JSON.stringify(returnVar));
            }
            else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                returnVar = {'return': 1};
                res.end(JSON.stringify(returnVar));
            }
        });
    },
    // to insert the comment into the database with CmtID as a refrence when getting the item out of the database
    postSubComment:function(UserId,cmtMsg,itemId,req,res) {

        var he = require('he');
        var mysql = require('mysql');
        cmtMsg = he.encode(cmtMsg);

        var connectionItem = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        var sql="INSERT INTO itemsubcmt (CmtID,MsgContent,PosterID) VALUES ("+itemId+",'"+cmtMsg+"',"+UserId+")";
        connectionItem.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                res.writeHead(200, {'Content-Type': 'application/json'});
                returnVar = {'return': 0};
                res.end(JSON.stringify(returnVar));
            }
            else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                returnVar = {'return': 1};
                res.end(JSON.stringify(returnVar));
            }
        });
    }
};