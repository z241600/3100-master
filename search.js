/**
 * Created by user on 23-Mar-17.
 */
module.exports = {

    advcacedSearch:function (res, targetName, priceRange, catalogId) {
        //lookup the target item in the db using priceRange and catalogId as parameter

        //return the itemId and other info if it exist

        //throw error:item not found and give Recommendation to user according to preference

        //update the user's preference with the item's catalog index or the catalogId if item is not found
    },

    simpleSearch: function (res,req,targetName) {
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
        console.log(targetName);
        targetName = he.encode(targetName);
        var htmlString="";
        var sql='SELECT * from itemdesc where ItemName like "%' + targetName + '%"';
        connectionItem.query(sql, function (error, results) {
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

                    sess.checkSession(req,res,function(res,bool,req){

                        console.log(bool);
                        if(bool==true)
                        {

                            res.render("searchLogged",{html:htmlString,userName:req.session.userName});

                        }else {
                            //console.log("NOT LOGGED");
                           res.render("search",{html:htmlString});
                        }
                    });

                    
                });
                
            }
        
        //lookup the target item in the db and return the itemId and other info if it exist

        //throw error:item not found and give Recommendation to user according to preference

        //update the user's preference with the item's catalog index
    });
    }, searchByCat:function(res,req,targetName)
    {
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
        targetName = he.decode(targetName);
        console.log(targetName);
        targetName = he.encode(targetName);
        var htmlString="";
        var sql='SELECT * from itemdesc where CatName="'+targetName+'"';
        console.log(sql);
        connectionItem.query(sql, function (error, results) {
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

                        sess.checkSession(req,res,function(res,bool,req){

                            console.log(bool);
                            if(bool==true)
                            {

                                res.render("searchLogged",{html:htmlString,userName:req.session.userName});

                            }else {
                                //console.log("NOT LOGGED");
                                res.render("search",{html:htmlString});
                            }
                        });


                    });

            }

        });
    },
    searchByNameAndCat: function (res,req,targetName,cat) {
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
        console.log(targetName);
        targetName = he.encode(targetName);
        var htmlString="";
        cat = he.decode(cat);
        var sql='SELECT * from itemdesc where ItemName like "%' + targetName + '%" AND CatName="'+cat+'"';
        console.log(sql);
        connectionItem.query(sql, function (error, results) {
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

                        sess.checkSession(req,res,function(res,bool,req){

                            console.log(bool);
                            if(bool==true)
                            {

                                res.render("searchLogged",{html:htmlString,userName:req.session.userName});

                            }else {
                                //console.log("NOT LOGGED");
                                res.render("search",{html:htmlString});
                            }
                        });


                    });

            }

            //lookup the target item in the db and return the itemId and other info if it exist

            //throw error:item not found and give Recommendation to user according to preference

            //update the user's preference with the item's catalog index
        });
    }
};