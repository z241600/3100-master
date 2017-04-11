/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    createItem: function(itemName,catId,price,photoNum,itemDesc,cat,res,req) {
        //create record in itemdb with these info plus the userId
        //console.log("insert item");
        //return 1 for success or -1 for fail
        var mysql = require("mysql");
        var he = require("he");
        var multer = require("multer");
        var session = require("express-session");

        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        itemName = he.encode(itemName);
        itemDesc = he.encode(itemDesc);
        //var sellerID=1;
        sellerID = req.session.userId;
        var sql="INSERT INTO itemdesc (ItemName,ActivityInd,SellerID,Price,PhotoNum,ItemDesc,CatName) VALUES ('"+itemName+"','A',"+sellerID+","+price.toString()+",'"+req.file.filename+"','"+itemDesc+"','"+cat+"'); ";
        console.log(sql);
        //res.writeHead(200, { 'Content-Type': 'application/json' });
        connection.query(sql, function (error, results) {
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
        //Perform back-end tasks (such as modifying the Actifity Ind),
        //serve the paypal information to the buyer, and notifying the seller about the trade.
    },
    updateItem:function (itemName,price,itemDesc,itemId,res,req) {
        //update the item's info, given the ID and the data needed in the JSON.
        var mysql = require("mysql");
        var session = require("express-session");
        var user = require("./user");

        var connectionItem = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        sql = "UPDATE itemdesc SET itemName = '"+itemName+"', price = "+price+",  itemDesc = '"+itemDesc+"' WHERE ItemID = "+itemId;
        connectionItem.query(sql, function (error, results) {
        if(error)
        {
            console.log(error);
            return 0;
        }else
        {
            returnVar = {head:"Update applied!",top:"will redirect to the item's page.",lower:"",background:"green",redir:"item?ID="+itemId};
            returnVar = user.getLoggedData(res,req,returnVar);
            res.render("MessageRedirLogged",returnVar);
        }
        });

    },
    retrieveUpdateItem:function(ItemID,res,req) {
        var mysql = require("mysql");
        var session = require("express-session");
        var user = require("./user");

        var connectionItem = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql="SELECT * FROM itemdesc WHERE ItemID="+ItemID;
        connectionItem.query(sql, function (error, results) {
            if (error) {

            }
            else
            {

                if(results.length<=0)
                {
                    res.render("message",{head:"Oops! The item you are looking for does not exist.",top:"We are sorry for any inconvience caused.",lower:"",background:"red"});
                    return 0;
                }
                var ItemIDVal = results[0]['ItemID'];
                var ItemNameVal = results[0]['ItemName'];
                var PriceVal= results[0]['Price'];
                var SellerID= results[0]['SellerID'];
                var ItemDescVal = results[0]['ItemDesc'];
                var CatNameVal = results[0]['CatName'];
                if(SellerID!=req.session.userId)
                {
                    res.render("message",{head:"Oops! You are not this item's poster.",top:"We are sorry for any inconvience caused.",lower:"",background:"red"});
                    return 0;
                }
                var returnVar={itemName:ItemNameVal,Price:PriceVal,ItemDesc:ItemDescVal,ItemID:ItemIDVal,CatName:CatNameVal};
                returnVar = user.getLoggedData(res,req,returnVar);
                res.render("editItem",returnVar);
            }
    });
    },
    retrieveItem:function(ItemID,res,req){
        var mysql = require("mysql");
        var session = require("express-session");
        var connectionItem = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql="SELECT * FROM itemdesc WHERE ItemID="+ItemID;
        connectionItem.query(sql, function (error, results) {
            if (error) {

                console.log(error);
                returnVar = 0;
                return returnVar;
            }else {

                if(results.length<=0)
                {
                    res.render("message",{head:"Oops! The item you are looking for does not exist.",top:"We are sorry for any inconvience caused.",lower:"",background:"red"});
                    return 0;
                }

                var ItemName = results[0]['ItemName'];
                var ActivityInd =  results[0]['ActivityInd'];
                var SellerID  = results[0]['SellerID'];
                var Price= results[0]['Price'];
                var PhotoNum= results[0]['PhotoNum'];
                var ItemDesc = results[0]['ItemDesc'];
                var BuyerId = results[0]['BuyerId'];
                if(SellerID==req.session.userId)
                {
                    //var buttonHtml="<a href='updateItem?ID="+ItemID+"'> Update Item Info</a>";
                    var buttonHtml = "<input type='button' value='Update Item Info' onclick='window.location.href =\"updateItem?ID="+ItemID+"\"'>";
                }
                else
                {
                    var buttonHtml="";
                }

                if(ActivityInd=="U")
                {
                    res.render("message",{head:"Oops! The item you are looking is unlisted by our staff.",top:"We are sorry for any inconvience caused.",lower:"",background:"red"});
                    return 0;
                }

                returnVar = results[0];

                returnVar['button'] = buttonHtml;
                var sql2="SELECT userName FROM userlogindata WHERE UserID="+SellerID;
                connection.query(sql2, function (error, results) {
                    if(error)
                    {
                        return 0;
                    }
                    else
                    {
                        var SellerName = results[0]['userName'];
                        returnVar['SellerName'] = SellerName;
                        res.render("item",returnVar);
                    }

                });
                }


            });


    }


};