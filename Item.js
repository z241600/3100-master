/**
 * Created by user on 23-Mar-17.
 */
module.exports = {
    createItem: function (itemName, catId, price, photoNum, itemDesc, cat, res, req) {
        //create record in itemdb with user inputted info plus the userId

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
        var sql = "INSERT INTO itemdesc (ItemName,ActivityInd,SellerID,Price,PhotoNum,ItemDesc,CatName) VALUES ('" + itemName + "','A'," + sellerID + "," + price.toString() + ",'" + req.file.filename + "','" + itemDesc + "','" + cat + "'); ";
        console.log(sql);
        //res.writeHead(200, { 'Content-Type': 'application/json' });
        connection.query(sql, function (error) {
            if (error) {
                console.log("Item insert failed!");
                console.log(error);
                returnVar = 0;
                return returnVar;
            } else {
                returnVar = 1;
                console.log("Item Insert successful!");
                //console.log(results);
                var sql2 = "SELECT LAST_INSERT_ID();";

                //get the last incremented id, and redir user to the created page.

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
                        returnVar = results[0]['LAST_INSERT_ID()'];
                        console.log(results);
                        console.log(returnVar);
                        res.render("messageRedirLogged", {
                            head: "Success! Item created successfully",
                            top: "Redirecting you to the page...",
                            lower: "",
                            background: "green",
                            redir: "./item?ID=" + results[0]['LAST_INSERT_ID()'],
                            userName: req.session.userName
                        });
                    }
                });
                // res.end(JSON.stringify(returnVar));
                // return returnVar;
            }
        });
    },
    BuyItem: function (ItemID, buyerID, res, req) {
        //Perform back-end tasks (such as modifying the Activity Ind),
        //serve the paypal information to the buyer, and notifying the seller about the trade.
        var Email = require('./Email');
        var mysql = require("mysql");
        var sql = "SELECT SellerID, Price FROM ItemDesc WHERE ItemID=" + ItemID;
        var sellerID;
        var itemPrice;
        var PaypalMeLink;
        var buyerName;
        var ActivityInd = 'U';
        var sellerEmail;
        var buyerEmail;
        console.log(sql);
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        var userconnection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        connection.query(sql, function (error, result) {
            if (error) {
                return console.log(error);
            }
            sellerID = result[0]['SellerID'];
            itemPrice = result[0]['Price'];
            var sql2 = "SELECT Email FROM UserLoginData WHERE UserID=" + sellerID;//seller email, paypal link
            console.log(sql2);
            // var sql2 = "SELECT Email, PaypalMeLink FROM UserData WHERE UserID=" + sellerID;//seller email, paypal link
            userconnection.query(sql2, function (error, result) {
                if (error) {
                    return console.log(error);
                }
                sellerEmail = result[0]['Email'];
                var sql3 = "SELECT Email FROM UserLoginData WHERE UserID=" + buyerID;//buyer email
                console.log(sql3);
                userconnection.query(sql3, function (error, result) {
                    if (error) {
                        return console.log(error);
                    }
                    buyerEmail = result[0]['Email'];
                    var sql4 = "UPDATE ItemDesc SET ActivityInd = '" + ActivityInd + "', BuyerID =" + buyerID + " WHERE ItemID=" + ItemID;//update
                    console.log(sql4);
                    connection.query(sql4, function (error, result) {
                        if (error) {
                            return console.log(error);
                        }
                        var sql5 = "SELECT PaypalMeLink FROM UserData WHERE UserID=" + sellerID;
                        console.log(sql5);
                        userconnection.query(sql5, function (error, result) {
                            if (error) {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                returnVar = {'return': 0};
                                res.end(JSON.stringify(returnVar));
                                return console.log(error);
                            }
                            PaypalMeLink = result[0]['PaypalMeLink'];
                            var sql6 = "SELECT PaypalName FROM UserData WHERE UserID=" + buyerID;
                            console.log(sql6);
                            userconnection.query(sql6, function (error, result) {
                                if (error) {
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    returnVar = {'return': 0};
                                    res.end(JSON.stringify(returnVar));
                                    return console.log(error);
                                }
                                buyerName = result[0]['PaypalName'];
                                Email.SendBuyEmail(sellerEmail, ItemID, buyerEmail, PaypalMeLink, itemPrice, buyerName);
                                console.log("Email sent");
                                var sql7 = "INSERT INTO history (UserID, ItemID) VALUES (" + buyerID + ", " + ItemID + ")";
                                console.log(sql7);
                                userconnection.query(sql7, function (error) {
                                    if (error) {
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        returnVar = {'return': 0};
                                        res.end(JSON.stringify(returnVar));
                                        return console.log(error);
                                    }
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    returnVar = {'return': 1};
                                    res.end(JSON.stringify(returnVar));
                                    return console.log("History added");
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    updateItem: function (itemName, price, itemDesc, itemId, res, req) {
        //update the item's info, given the ID and the data needed.
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
        sql = "UPDATE itemdesc SET itemName = '" + itemName + "', price = " + price + ",  itemDesc = '" + itemDesc + "' WHERE ItemID = " + itemId;
        connectionItem.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                return 0;
            } else {
                returnVar = {
                    head: "Update applied!",
                    top: "will redirect to the item's page.",
                    lower: "",
                    background: "green",
                    redir: "item?ID=" + itemId
                };
                returnVar = user.getLoggedData(res, req, returnVar);
                res.render("MessageRedirLogged", returnVar);
            }
        });
    },
    retrieveUpdateItem: function (ItemID, res, req) {
        // get the item's info, and display them on the website, for editing the item's use.
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
        var sql = "SELECT * FROM itemdesc WHERE ItemID=" + ItemID;
        connectionItem.query(sql, function (error, results) {
            if (error) {
            }
            else {
                if (results.length <= 0) {
                    res.render("message", {
                        head: "Oops! The item you are looking for does not exist.",
                        top: "We are sorry for any inconvience caused.",
                        lower: "",
                        background: "red"
                    });
                    return 0;
                }
                var ItemIDVal = results[0]['ItemID'];
                var ItemNameVal = results[0]['ItemName'];
                var PriceVal = results[0]['Price'];
                var SellerID = results[0]['SellerID'];
                var ItemDescVal = results[0]['ItemDesc'];
                var CatNameVal = results[0]['CatName'];
                if (SellerID != req.session.userId) {
                    res.render("message", {
                        head: "Oops! You are not this item's poster.",
                        top: "We are sorry for any inconvience caused.",
                        lower: "",
                        background: "red"
                    });
                    return 0;
                }
                var returnVar = {
                    itemName: ItemNameVal,
                    Price: PriceVal,
                    ItemDesc: ItemDescVal,
                    ItemID: ItemIDVal,
                    CatName: CatNameVal
                };
                returnVar = user.getLoggedData(res, req, returnVar);
                res.render("editItem", returnVar);
            }
        });
    },
    retrieveItem: function (ItemID, res, req) {
        //get the item's info, and get all the comment associated with the item.
        //including get the user name given the userID.
        //because of the event base nature of nodeJS, we have to use async (async watterfall in this case) to avoid callback hell.
        var mysql = require("mysql");
        var session = require("express-session");
        var async = require("async");
        var sess = require("./session");
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
        var sql = "SELECT * FROM itemdesc WHERE ItemID=" + ItemID;
        connectionItem.query(sql, function (error, results) {
            if (error) {
                console.log(error);
                returnVar = 0;
                return returnVar;
            } else {
                if (results.length <= 0) {
                    res.render("message", {
                        head: "Oops! The item you are looking for does not exist.",
                        top: "We are sorry for any inconvience caused.",
                        lower: "",
                        background: "red"
                    });
                    return 0;
                }
                var ItemName = results[0]['ItemName'];
                var ActivityInd = results[0]['ActivityInd'];
                var SellerID = results[0]['SellerID'];
                var Price = results[0]['Price'];
                var PhotoNum = results[0]['PhotoNum'];
                var ItemDesc = results[0]['ItemDesc'];
                var BuyerId = results[0]['BuyerId'];
                if (SellerID == req.session.userId) {
                    //var buttonHtml="<a href='updateItem?ID="+ItemID+"'> Update Item Info</a>";
                    var buttonHtml = "<input type='button' value='Update Item Info' onclick='window.location.href =\"updateItem?ID=" + ItemID + "\"'>";
                }
                else {
                    var buttonHtml = "<input type='button' class='btn' id='buyButton' value='Buy this item'>'";
                }
                if (ActivityInd == "U" && SellerID != req.session.userId) {
                    res.render("message", {
                        head: "Oops! The item you are looking is unlisted by our staff.",
                        top: "We are sorry for any inconvience caused.",
                        lower: "",
                        background: "red"
                    });
                    return 0;
                }
                returnVar = results[0];
                returnVar['button'] = buttonHtml;
                var htmlString = "";
                var mainCmt = [];
                var subCmt = [];
                async.waterfall([
                    function (callback) {
                        var sql2 = "SELECT userName FROM userlogindata WHERE UserID=" + SellerID;
                        connection.query(sql2, function (error, results) {
                            if (error) {
                                return 0;
                            }
                            else {
                                var SellerName = results[0]['userName'];
                                returnVar['SellerName'] = SellerName;
                                callback(null);
                            }
                        });
                    },
                    function (callback1) {
                        var resultstemp;
                        var sql3 = "SELECT * FROM itemcmt WHERE ItemID=" + ItemID;
                        connectionItem.query(sql3, function (error, results) {
                            if (error) {
                            }
                            else {
                                //console.log(results);
                                async.each(results, function (entry, callbackEach) {
                                    mainCmt[entry['CmtID']] = entry;
                                    callbackEach();
                                });
                            }
                            callback1(null, resultstemp);
                        });
                    },
                    function (resultsBefore, callback2) {
                        //console.log(resultsBefore);
                        async.each(mainCmt, function (entry, callbackEach) {
                            if (entry) {
                                var sql5 = "SELECT * FROM itemsubcmt WHERE CmtID=" + entry['CmtID'];
                                console.log(sql5);
                                connectionItem.query(sql5, function (error, resultsSubCmt) {

                                    //console.log(resultsSubCmt);
                                    if (error) {
                                    }
                                    else {
                                        console.log(resultsSubCmt);
                                        async.each(resultsSubCmt, function (SubCmtEntry, callbackSubCmt) {
                                            subCmt[SubCmtEntry['SubCmtID']] = SubCmtEntry;
                                            callbackSubCmt();
                                        });
                                    }
                                    callbackEach();
                                });
                            }
                            else {
                                callbackEach();
                            }
                        }, function (err) {
                            callback2();
                        });
                    }, function (callback3) {
                        async.each(mainCmt, function (mainCmtEntry, callbackEach) {
                            if (mainCmtEntry) {
                                var sql4 = "SELECT userName FROM userlogindata WHERE UserID=" + mainCmtEntry['PosterID'];
                                connection.query(sql4, function (error, results) {
                                    mainCmt[mainCmtEntry['CmtID']]['PosterName'] = results[0]['userName'];
                                    callbackEach();
                                });
                            }
                            else {
                                callbackEach();
                            }
                        }, function (err) {
                            callback3();
                        });
                    }
                    , function (callback4) {
                        async.each(subCmt, function (subCmtEntry, callbackEach) {
                            //console.log(subCmtEntry);
                            if (subCmtEntry) {
                                var sql6 = "SELECT userName FROM userlogindata WHERE UserID=" + subCmtEntry['PosterID'];
                                connection.query(sql6, function (error, results) {
                                    subCmt[subCmtEntry['SubCmtID']]['PosterName'] = results[0]['userName'];
                                    callbackEach();
                                });
                            }
                            else {
                                callbackEach();
                            }
                        }, function (err) {
                            // htmlString += "</div>";
                            callback4();
                        });
                    }, function (callback5) {
                        console.log(subCmt);
                        console.log(mainCmt);
                        async.each(mainCmt, function (mainCmtEntry, callbackEach1) {
                            if (mainCmtEntry) {
                                htmlString += "<div class='well cmtMainBlock'>";
                                htmlString += mainCmtEntry['MsgContent'];
                                htmlString += "<br>by ";
                                htmlString += mainCmtEntry['PosterName'];
                                htmlString += " on ";
                                htmlString += mainCmtEntry['SentDate'];
                                htmlString += "<br>";
                                async.each(subCmt, function (subCmtEntry, callbackEachSub) {
                                    if (subCmtEntry) {
                                        if (subCmtEntry['CmtID'] == mainCmtEntry['CmtID']) {
                                            htmlString += subCmtEntry['MsgContent'];
                                            htmlString += "<br>by ";
                                            htmlString += subCmtEntry['PosterName'];
                                            htmlString += " on ";
                                            htmlString += subCmtEntry['SentDate'];
                                            htmlString += "<br>";
                                            callbackEachSub();
                                            console.log(htmlString);
                                        }
                                    }
                                }, function (err) {
                                    console.log(mainCmt);
                                    console.log(subCmt);
                                    callbackEach1();
                                });
                                htmlString += "<div class='form-group'><div class='col-sm-8'><input type='text' id='CmtID-" + mainCmtEntry['CmtID'];
                                htmlString += "' name='email' class='form-control subCmtText' placeholder='Write Comment...' > </div> <div class='col-sm-2'> <input type='button' class='postSubCmtButton btn' data-value=" + mainCmtEntry['CmtID'];
                                htmlString += "  value='post!'  > <input type='hidden'></input></input></div> </div>";
                                htmlString += "</div>";
                            }
                        }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        sess.checkSession(req, res, function (res, bool, req) {
                            console.log(bool);
                            if (bool != true) {
                                //console.log("LOGGED");
                                returnVar['enable'] = "disabled";
                                returnVar['html'] = htmlString;
                                returnVar['userId'] = -1;
                                res.render("item", returnVar);
                            }
                            else {
                                returnVar['userId'] = req.session.userId;
                                returnVar['enable'] = "";
                                console.log(htmlString);
                                returnVar['html'] = htmlString;
                                returnVar['userId'] = req.session.userId;
                                returnVar['userName'] = req.session.userName;
                                res.render("itemLogged", returnVar);
                            }
                            return 0;
                        });
                        callback5();
                    },
                ], function (err) {
                    return 0;
                });
            }
        });
    },
    indexItem: function (req, res, bool, returnVar) {
        //get 3 items from the database for display on the index page
        if (!returnVar) {
            returnVar = {};
        }
        var mysql = require("mysql");
        var session = require("express-session");
        var user = require("./user");
        var async = require("async");
        var connectionItem = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        var sql = "SELECT * FROM itemdesc  WHERE ActivityInd='A' ORDER BY ItemID  DESC  LIMIT 4     ";
        connectionItem.query(sql, function (error, results) {
            if (error) {
            }
            else {
                console.log(results);
                var i = 0;
                async.each(results, function (entry, callback) {
                    returnVar["ItemID" + i] = entry['ItemID'];
                    returnVar["ItemName" + i] = entry['ItemName'];
                    returnVar["SellerID" + i] = entry['SellerID'];
                    returnVar["Price" + i] = entry['Price'];
                    returnVar["PhotoNum" + i] = entry['PhotoNum'];
                    returnVar["ItemDesc" + i] = entry['ItemDesc'];
                    returnVar["CatName" + i] = entry['CatName'];
                    i++;
                    console.log(i);
                    callback();
                }, function (err) {
                    if (bool) {
                        res.render('indexLogged', returnVar);
                    }
                    else {
                        res.render('index', returnVar);
                    }
                });
            }
        });
    },
    historyDisplay: function (res, req) {
        //display the item that a user bought by querying the itemdesc DB with buyerID.
        var mysql = require("mysql");
        var he = require("he");
        var async = require("async");
        var sess = require("./session");
        var session = require("express-session");
        var connectionItem = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
        var userID = req.session.userId;
        console.log(userID);
        var htmlString = "";
        var sql = "SELECT * from ItemDesc where BuyerID=" + userID;
        connectionItem.query(sql, function (error, results) {
            if (error) {
                htmlString = "<h2>Sorry! Something went wrong! Please try again!</h2>";
            }
            else {
                //console.log(results.length);
                if (results.length <= 0) {
                    htmlString = "<h2>Sorry! No item is in your history.</h2>";
                }
                async.each(results, function (Entry, callback) {
                        htmlString += '<div class="row"> <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 selectedBox"> <img src="\\images\\item\\' + Entry['PhotoNum'];
                        htmlString += '" style="height:100%"></img></div> <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 selectedBox"> <div class="row"> <a href="/item?ID=' + Entry['ItemID'];
                        htmlString += '"> <h2>' + Entry['ItemName'];
                        htmlString += '</h2></a> <br> <h4>$' + Entry['Price'];
                        htmlString += '</h4> <br> <h4>Category:' + Entry['CatName'];
                        htmlString += '</h4> </div> </div> </div>"';
                        callback();
                    },
                    function (err) {
                        sess.checkSession(req, res, function (res, bool, req) {
                            res.render("history", {html: htmlString, userName: req.session.userName});
                        });
                    });
            }
            //lookup the target item in the db and return the itemId and other info if it exist
            //throw error:item not found and give Recommendation to user according to preference
            //update the user's preference with the item's catalog index
        });
    }
};