/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    createItem: function(itemName,catId,price,photoNum,itemDesc,res,req) {
        //create record in itemdb with these info plus the userId
        //console.log("insert item");
        //return 1 for success or -1 for fail
        var mysql = require("mysql");
        var he = require("he");
        var multer = require("multer");

        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        itemName = he.encode(itemName);
        itemDesc = he.encode(itemDesc);
        var sellerID=1;
        var sql="INSERT INTO itemdesc (ItemName,ActivityInd,SellerID,Price,PhotoNum,ItemDesc) VALUES ('"+itemName+"','A',"+sellerID.toString()+","+price.toString()+",'"+req.file.filename+"','"+itemDesc+"'); ";
        console.log(sql);
        //res.writeHead(200, { 'Content-Type': 'application/json' });
        connection.query(sql, function (error) {
            if (error) {
                console.log("Item insert failed!");
                console.log(error);
                returnVar = 0;
                return returnVar;
            }else {
               returnVar = 1;
                console.log("Item Insert successful!");
                //console.log(results);
                var sql2 = "SELECT LAST_INSERT_ID();";
                console.log(sql);
                connection.query(sql2, function (error, results) {
                    if (error) {
                        console.log("Item insert failed!");
                        console.log(error);
                        returnVar = 0;
                        return returnVar;
                    }
                    else {
                        console.log("Item insert successful!");
                        //console.log(results[0]['LAST_INSERT_ID()']);
                        //console.log(results);
                        returnVar = results[0]['LAST_INSERT_ID()'] ;
                        console.log(results);
                        console.log(returnVar);


                    }

                });
              // res.end(JSON.stringify(returnVar));
               // return returnVar;
            }
        });

    },
    BuyItem:function(ItemID,buyerID)
    {
        //Perform back-end tasks (such as modifying the Activity Ind),
        //serve the paypal information to the buyer, and notifying the seller about the trade.
        var Email= require('../Email');
        var mysql = require("mysql");

        var sql = "SELECT SellerID, Price FROM ItemDesc WHERE ItemID=" + ItemID;
        var sellerID;
        var itemPrice;
        var PaypalMeLink;
        var buyerName;
        var ActivityInd = 'U';
        var sellerEmail;
        var buyerEmail;



        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        connection.query(sql, function (error,result){
            if (error) {
                return console.log(error);
            }
            sellerID=result[0]['SellerID'];
            itemPrice=result[0]['itemPrice'];
            var sql2 = "SELECT Email, PaypalMeLink FROM UserData WHERE UserID=" + sellerID;//seller email, paypal link
            connection.query(sql2, function (error,result){
                if (error) {
                    return console.log(error);
                }
                sellerEmail = result[0]['Email'];
                PaypalMeLink= result[0]['PaypalMeLink'];
                var sql3 = "SELECT Email, PaypalName FROM UserData WHERE UserID=" + buyerID;//buyer email
                connection.query(sql3, function (error,result) {
                    if (error) {
                        return console.log(error);
                    }
                    buyerName=result[0]['PaypalName'];
                    buyerEmail=result[0]['Email'];
                    var sql4 = "UPDATE ItemDesc SET ActivityInd = '"+ActivityInd+"' WHERE ItemID="+ItemID;//update
                    connection.query(sql4, function (error,result) {
                        if (error) {
                            return console.log(error);
                        }
                        Email.SendBuyEmail(sellerID, ItemID, buyerEmail, PaypalMeLink, itemPrice, buyerName);
                        return console.log("Email sent");
                    });
                });
            });
        });




    },
    updateItem:function (ItemID,json) {
        //update the item's info, given the ID and the data needed in the JSON.

    }



};