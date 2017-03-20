/**
 * Created by user on 18-Mar-17.
 */
module.exports = {

    printDB: function (req, res) {
        var jsonresults;
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "csci3100",
            "database": "user"
        });
        var sql = "SELECT * FROM userlogindata WHERE UserID = 1";
        connection.query(sql, function (error, results) {
            if (error) {
                return console.error(error);
            }
            jsonresults = results[0];
            console.log(results);
            //jsonresults = JSON.parse(jsonresults);

            jsonresults.title = 'hahah';
            // jsonresults = JSON.stringify(jsonresults);
            res.render('user', jsonresults);
            console.log(jsonresults);

            //jaonresults = jaonresults.concat(" title: 'Express'");
            connection.end();

        });

    }
};
