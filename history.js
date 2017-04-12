/**
 * Created by Leo Ma on 10/4/2017.
 */
module.exports={
    history: function (res,req, userID) {
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
                htmlString="<h2>Sorry! Something went wrong! Please try again!</h2>";
            }
            else
            {
                //console.log(results.length);
                if(results.length<=0)
                {
                    htmlString="<h2>Sorry! No item met your search requirements. Please try again.</h2>";
                }

                async.each(results,function (Entry,callback) {
                        htmlString+='<div class="row"> <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 selectedBox"> <img src="\\images\\item\\'+Entry['PhotoNum'];
                        htmlString+= '" style="height:100%"></img></div> <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 selectedBox"> <div class="row"> <a href="/item?ID=' +Entry['ItemID'];
                        htmlString+= '"> <h2>'+Entry['ItemName'];
                        htmlString+= '</h2></a> <br> <h4>$' +Entry['Price'];
                        htmlString+='</h4> <br> <h4>Category:' +Entry['CatName'];
                        htmlString+='</h4> </div> </div> </div>"';
                        callback();

                    },
                    function (err) {


                                //console.log("NOT LOGGED");
                                res.render("search",{html:htmlString});



                    });

            }
        });
    }
};