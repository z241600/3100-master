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

    getArgument: function (argument){
    var index = process.argv.indexOf(argument);

    return (index === -1) ? null : process.argv[index + 1];
},

updateRecord: function() {
    var userName = getArgument('userName');
    var password = getArgument('password');
    var email = getArgument('email');
    var lastName = getArgument('lastName');
    var firstName = getArgument('firstName');
    var addr = getArgument('addr');
    var telNo = getArgument('telNo');
    var location = getArgument('location');
    var id = getArgument('--id');

    var mysql = require("mysql");
    var connection = mysql.createConnection({
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "csci3100",
        "database": "user"
    });


    sql_stmt = "UPDATE Users SET userName = ?,password = ?,email = ?,lastName = ?, firstName = ?, addr = ?, telNo = ?, location = ?, WHERE id = ?";

    var values = [userName, password, email, lastName, firstName, addr, telNo, location, id];

    sql_stmt = mysql.format(sql_stmt, values);

    connection.query(sql_stmt, function (error) {
        if (error) {
            console.log('The following error occured while trying to insert a new record ' + error.message);
        }
        console.log();
        console.log('Updated User with id ' + id);
    })
}
};