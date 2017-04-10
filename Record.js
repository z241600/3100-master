/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    browseRecord: function (res,itemId) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT I.ItemID, I.ItemName, U.userName, I.Price, I.PhotoNum, I.ItemDesc, I.CatName FROM ItemDesc I, UserLoginData U WHERE "
            +"I.SellerID=U.UserID AND I.ActivityInd='active' AND I.ItemID="+itemId+";";
        console.log(sql);
        connection.query(sql, function(error, results) {
            if (error) {
                return console.error(error);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (!Object.keys(results).length) {
                console.log("No results found :(");
                console.log("Interested in the following items?");
                //call recommend
            }
            return results;
        });
        //lookup the item's catalog with itemId from db
        //update the user's preference with the catalog name
    },
    askForRecommend: function (res, userID) {
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        //do something to ask user to tick a few categories from a list
        //if yes, then
        var sql = "INSERT INTO Preference(UserID, CatName) VALUES ("+userID+", '"+catName+"');";
        console.log(sql);
        connection.query(sql, function(error, results) {
            if (error) {
                return console.error(error);
            }
            return results;
        });
    },
    recommend: function (res, userID) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT I.ItemID FROM ItemDesc I, UserLoginData U, Preference P WHERE "
            +"I.SellerID=U.UserID AND P.UserID=U.UserID AND I.ActivityInd='active' AND P.UserID = "+userID+";";
        console.log(sql);
        connection.query(sql, function(error, results) {
            if (error) {
                return console.error(error);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return results;
        });
        //lookup for the user's preference as json from the db
        //parse the string into proper json

        //lookup som
        // e item according to preference json in terms of catalogId

        //return the itemId
    }
};