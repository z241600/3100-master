/**
 * Created by Leo Ma on 10/4/2017.
 */
module.exports={
    history: function (res, userID) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT I.ItemID, I.ItemName, U.userName, I.Price, I.PhotoNum, I.ItemDesc, I.CatName FROM ItemDesc I, UserLoginData U WHERE "
            +"I.buyerID=U.UserID AND I.ActivityInd='sold' AND I.buyerID="+userID+";";
        console.log(sql);
        connection.query(sql, function(error, results) {
            if (error) {
                return console.error(error);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            if (!Object.keys(results).length) {
                console.log("No history found.");
            }
            return results;
        });
    }
};