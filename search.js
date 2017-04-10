/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    //Search by itemID or sellerID
    idSearch:function (res, targetID) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT I.ItemID, I.ItemName, U.userName, I.Price, I.PhotoNum, I.ItemDesc , I.CatName FROM ItemDesc I, UserLoginData U WHERE "
            +"I.SellerID=U.UserID AND I.ActivityInd='active' AND U.UserID="+targetID+" OR I.ItemID="+targetID+";";
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
        //lookup the target item in the db using priceRange and catalogId as parameter
        //return the itemId and other info if it exist
        //throw error:item not found and give Recommendation to user according to preference
        //update the user's preference with the item's catalog index or the catalogId if item is not foundzzz
    },

    //Search by price range
    priceSearch:function (res, priceUpperLimit, priceLowerLimit) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT I.ItemID, I.ItemName, U.userName, I.Price, I.PhotoNum, I.ItemDesc , I.CatName FROM ItemDesc I, UserLoginData U WHERE "
            +"I.SellerID=U.UserID AND I.ActivityInd='active' AND I.Price >= "+priceLowerLimit+" AND I.Price <= "+priceUpperLimit+";";
        console.log(sql);
        connection.query(sql, function(error, results) {
            if (error) {
                return console.error(error);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (!Object.keys(results).length)
            {
                console.log("No results found :(");
                console.log("Interested in the following items?");
                //call recommend
            }
            return results;
        });
        //lookup the target item in the db using priceRange and catalogId as parameter
        //return the itemId and other info if it exist
        //throw error:item not found and give Recommendation to user according to preference
        //update the user's preference with the item's catalog index or the catalogId if item is not found
    },

    //Browse items in different categories
    categorySearch:function (res, categoryName) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT I.ItemID, I.ItemName, U.userName, I.Price, I.PhotoNum, I.ItemDesc , I.CatName FROM ItemDesc I, UserLoginData U "
            +"WHERE I.SellerID=U.UserID AND I.ActivityInd='active' AND I.CatName='"+categoryName+"';";
        console.log(sql);
        connection.query(sql, function(error, results) {
            if (error) {
                return console.error(error);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (!Object.keys(results).length)
            {
                console.log("No results found :(");
                console.log("Interested in the following items?");
                //call recommend
            }
            return results;
        });
        //lookup the target item in the db using priceRange and catalogId as parameter
        //return the itemId and other info if it exist
        //throw error:item not found and give Recommendation to user according to preference
        //update the user's preference with the item's catalog index or the catalogId if item is not found
    },

    //Search items by key words in seller name, item desc, item name
    keywordSearch: function (res,targetName) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT I.ItemID, I.ItemName, U.userName, I.Price, I.PhotoNum, I.ItemDesc , I.CatName FROM ItemDesc I, UserLoginData U "
            +"WHERE I.SellerID=U.UserID AND I.ActivityInd='active' AND I.ItemName LIKE '%"+targetName+"'% OR U.userName LIKE '%"+targetName+"'% OR"
            +" I.ItemDesc LIKE '%"+targetName+"'%;";
        console.log(sql);
        connection.query(sql, function(error, results) {
            if (error) {
                return console.error(error);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (!Object.keys(results).length)
            {
                console.log("No results found :(\n");
                console.log("Interested in the following items?");
                //call recommend
            }
            return results;
        });
        //lookup the target item in the db and return the itemId and other info if it exist
        //throw error:item not found and give Recommendation to user according to preference
        //update the user's preference with the item's catalog index
    }
};