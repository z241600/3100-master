/**
 * Created by user on 20-Mar-17.
 */
module.exports = {

    checkUserDup: function (userName,res) {

        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });

        var sql = "SELECT UserId FROM userlogindata WHERE userName='"+userName+"'";
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }


            res.writeHead(200, { 'Content-Type': 'application/json' });

            if (!Object.keys( results).length)
            {
                returnVar = {'UserId':-1};
            }
            else{
                returnVar = results[0];
            }
            res.end(JSON.stringify(returnVar));

            return returnVar;
    });
    },
    CreateUser:function (UserName,Hash,Salt,AuthToken,FirstName,LastName,Addr,TelNo,Email,Location){
        var he =  require("he");
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        FirstName = he.encode(FirstName);
        LastName = he.encode(LastName);
        Addr = he.encode(Addr);
        TelNo = he.encode(TelNo);
        Location = he.encode(Location);
        var sql = "INSERT INTO UserData (FirstName,LastName,Addr,TelNo,Location) VALUES ('"+FirstName+"','"+LastName+"',,'"+Addr+"',,'"+TelNo+"',,'"+Location+"',)";
        console.log(sql);
        connection.query(sql, function (error, results) {

            //res.render('signup', {});
        });
    },
    updateUserData:function (UserID,json)
    {
        //to interface with the DB to update user's data
    }



};