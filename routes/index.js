var express = require('express');
var user = require('../User');
var TwoFA = require('../2FA');
var userDB = require("./userDB");
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');

var Email = require('../Email');
var crypto = require('crypto');


var sess = require("../session");


var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


//To get GET parameters like xyz.com/?a=1&b=1, use
//req.query.a and req.query.b
//To get POST parameters, use
//var user_id = req.body.VARNAME;

var ssn;
/* GET home page. */
router.get('/', function(req, res, next) {

    ssn = req.session;
    console.log(req.sessionID);
    console.log(ssn.userId);
    console.log(ssn.userName);
    sess.checkSession(req,res,function(res,bool,req){
        console.log(bool);
        if(bool==true)
        {
            console.log("LOGGED");
            res.render('indexLogged', {userName:req.session.userName});
        }else {
            console.log("NOT LOGGED");
            res.render('index', {});
        }
    });


});

router.get('/user',function (req,res,next) {

  userDB.printDB(req,res);

});
router.get('/checkUserDup',function (req,res,next) {
    var userName = req.query.userName;
    user.checkUserDup(userName,res);
});
router.get('/checkEmailDup',function (req,res,next) {
    var userName = req.query.userName;
    user.checkEmailDup(userName,res);
});
router.get('/enableTwoAuth',function (req,res,next) {

    sess.checkSession(req,res,function(res,bool,req){

        console.log(bool);
        if(bool==true)
        {
            //console.log("LOGGED");
            TwoFA.generate2FAToken(res,req.session.userId);
        }else {
            //console.log("NOT LOGGED");
            res.render('messageRedir',{background:'red',head:"Ooops!",top:"You are not logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
        }
    });
});

router.get('/browseRecord', function (req,res,next){
    var itemId = req.body.itemId;
    browseRecord.init(res,itemId);
});

router.get('/simpleSearch', function (req,res,next){
    var targetName = req.body.targetName;
    simpleSearch.init(res,targetName);
});

router.get('/advanceSearch', function (req,res,next){
    var targetName = req.body.targetName;
    var priceRange = req.body.priceRange;
    var catalogId = req.body.catalogId;
    advanceSearch.init(res,targetName,priceRange,catalogId);
});

router.get('/simpleSearch', function (req,res,next){
    var targetName = req.body.targetName;
    simpleSearch.init(res,targetName);
});

router.get('/recommend',function (req,res,next){
    //this one need some more followup
    recommend.init(res);
});

router.get('/SignUp',function (req,res,next){
    ssn = req.session;
    sess.checkSession(req,res,function(res,bool,req){
        console.log(bool);
        if(bool==true)
        {
            //console.log("LOGGED");
            res.render('messageRedir',{background:'green',head:"Hello!",top:"You have logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
        }else {
            //console.log("NOT LOGGED");
            res.render('signup', {});
        }
    });

});

router.get("/login",function (req,res,next){
    //this one need some more followup
    ssn = req.session;
    sess.checkSession(req,res,function(res,bool,req){
        console.log(bool);
        if(bool==true)
        {
            //console.log("LOGGED");
            res.render('messageRedir',{background:'green',head:"Hello!",top:"You have logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
        }else {
            //console.log("NOT LOGGED");
            res.render('signin', {});
        }
    });

});

router.get("/item",function (req,res,next){
    //this one need some more followup
    var itemID = req.body.ID;
    item.retrieveItem(itemID,res,req);
});

router.get("/createItem",function (req,res,next){
    //this one need some more followup

    ssn = req.session;
    sess.checkSession(req,res,function(res,bool,req){
        console.log(bool);
        if(bool==true)
        {
            //console.log("LOGGED");
            res.render("additem",{});
        }else {
            //console.log("NOT LOGGED");
            res.render('messageRedir',{background:'red',head:"Ooops!",top:"You are not logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
        }
    });
});
router.get("/inputTwoFactorToken",function (req,res,next) {
res.render("input2FAToken",{});
});


router.post("/verifyTwoFactorToken",function (req,res,next) {
    /*ssn = req.session;
    ssn.userName =  results[0]['userName'];
    ssn.userId = userID;
    ssn.TwoFAToken = results[0]['TwoFactorAuth'];
    ssn.redirectTo ="login"*/
    ssn = req.session;
    if(ssn.TwoFAToken==""||ssn.userName=="")
    {
        res.render('messageRedir',{background:'red',head:"Ooops!",top:"You are not allowded in here!",lower:"you will be redirected to our haome page." ,redir:"../"});
        return 0;
    }
    if(ssn.redirectTo =="login")
    {
        console.log("login Detected!");
        TwoFA.verify2FAToken(ssn.userId,req.body.pwd,res,function (res,verified) {
            if(verified)
            {
                sess.createSession(req,ssn.userId,res);
            }
            else
            {
                sess.destroy();
                res.render('messageRedir',{background:'red',head:"Ooops!",top:"Two Factor Authendication code invaild!",lower:"you will be redirected to our haome page." ,redir:"../"});
            }
        });
    }
});

router.get("/loggout",function (req,res,next){
    //this one need some more followup
    user.LogoutUser(res,req);
});

router.get('/verifyEmailToken', function(req,res,next){
    var token = req.query.token;
    var userID = req.query.userID;
    Email.AuthEmailToken(userID,token);
});

router.post('/createItem',function(req,res,next){
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var catId = req.body.catId;
    var price = req.body.price;
    var photoNum = req.body.photoNum;
    createItem.init(res,itemName,catId,price,photoNum,itemDesc);
});

router.post('/verifyF2AToken',function (req,res,next) {

            var token = req.body.token;
            var secret = req.body.secret;
            TwoFA.verify2FASecrete(res, token, secret,req);



});

router.post('/userLogin',function (req,res,next) {

    var inputUsername = req.body.email;
    var inputPassword = req.body.pwd;
    user.LoginUser(res,inputUsername,inputPassword,req);

});

router.post('/createUser', function (req,res,next){
    var userName = req.body.userName;
    var password = req.body.password;
    var email = req.body.email;
    var lastName = req.body.lastName;
    var firstName = req.body.firstName;
    var addr = req.body.addr;
    var telNo = req.body.telNo;
    var location = req.body.location;

    user.CreateUser(res,userName,password,firstName,lastName,addr,telNo,email,location);
});





module.exports = router;
