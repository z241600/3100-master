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
    updateItem:function (ItemID,json) {
        //update the item's info, given the ID and the data needed in the JSON.
        //to interface with the DB to update user's data


        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var data = {"userName": "", "UserPassword": "", "email": "", "lastName": "", "firstName":"","addr":"", "telNo":"", "location":"", "UserID":""};
        var parsedData = json.parse(data);

        var userName = parsedData.userName;
        var UserPassword = parsedData.UserPassword;
        var email = parsedData.email;
        var lastName = parsedData.lastName;
        var firstName = parsedData.firstName;
        var addr = parsedData.addr;
        var telNo = parsedData.telNo;
        var location = parsedData.location;





        sql_stmt = "UPDATE Users SET userName = ?,UserPassword = ?,email = ?,lastName = ?, firstName = ?, addr = ?, telNo = ?, location = ?, WHERE UserID = ?";

        var values = [userName, UserPassword, email, lastName, firstName, addr, telNo, location, UserID];

        sql_stmt = mysql.format(sql_stmt, values);

        connection.query(sql_stmt, function (error) {
            if (error) {
                console.log('The following error occured while trying to insert a new record ' + error.message);
            }
            console.log();
            console.log('Updated User information with id ' + id);
        })



    },

    searchItem: function (req,res) {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });




            connection.query('SELECT item from TABLE_NAME where item like "%' + req.query.key + '%"',
                function (err, rows, fields) {
                    if (err) throw err;
                    var data = [];
                    for (i = 0; i < rows.length; i++) {
                        data.push(rows[i].first_name);
                    }
                    res.end(JSON.stringify(data));
                });


    },


    retrieveItem:function(ItemID,res,req){
        var mysql = require("mysql");

        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "item"
        });
    }


};