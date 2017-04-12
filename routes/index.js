var express = require('express');
var user = require('../User');
var TwoFA = require('../2FA');
var comment = require('../comment');
var userDB = require("./userDB");
var search = require("../search");
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var message = require("../Message");

var Email = require('../Email');
var item= require('../Item');
var crypto = require('crypto');
var multer = require('multer');
var path = require("path");


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
            returnVar = {};
            returnVar = user.getLoggedData(res,req,returnVar);
            //res.render('indexLogged', returnVar);
            item.indexItem(req,res,bool,returnVar);

        }else {
            console.log("NOT LOGGED");
            //res.render('index', {});
            item.indexItem(req,res,bool);
        }
    });


});
router.get('/updateUserData',function (req,res,next) {
    sess.checkSession(req,res,function(res,bool,req){
        console.log(bool);
        if(bool==true)
        {
           // console.log("LOGGED");
            user.updateUserData(res,req);
        }else {
            //console.log("NOT LOGGED");
            res.render('messageRedir',{background:'red',head:"Ooops!",top:"You are not logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
        }
    });

});

router.get('/message',function (req,res,next) {
    sess.checkSession(req,res,function(res,bool,req){
        console.log(bool);
        if(bool==true)
        {
            var count =0;
            // console.log("LOGGED");
            message.retrievePM(res,req,count);
        }else {
            //console.log("NOT LOGGED");
            res.render('messageRedir',{background:'red',head:"Ooops!",top:"You are not logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
        }
    });

});

router.post("/postPM",function(req,res,next) {

    var receiving = req.body.senderId;
    var msg = req.body.msg;
    var userId = req.body.userId;
    //userId is the one sending , senderId is the one receiving
    message.sendPM(res,req,userId,receiving,msg);

});
router.post("/updateUserDataAction",function(req,res,next){

    var FirstName=req.body.firstName;
    //console.log("marker");
    var LastName=req.body.lastName;
    var Addr=req.body.addr;
    var TelNo=req.body.telNo;
    var Location=req.body.location;
    var PaypalMeLink=req.body.paypalMe;
    var UserId=req.body.UserId;

    user.updateUserDataAction(FirstName,LastName,Addr,TelNo,Location,PaypalMeLink,UserId,res,req);

});

router.get('/updateItem',function (req,res,next) {

    var itemID = req.query.ID;

        sess.checkSession(req,res,function(res,bool,req){
            //console.log(bool);
            if(bool==true)
            {
                item.retrieveUpdateItem(itemID,res,req);
            }else {
                res.render('messageRedir',{background:'red',head:"Ooops!",top:"You are not logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
            }
        });
});
router.post('/updateItemAction',function (req,res,next) {

    var itemName = req.body.itemName;
    var price = req.body.Price;
    var itemDesc = req.body.ItemDesc;
    var itemId = req.body.itemId;

    sess.checkSession(req,res,function(res,bool,req){
        //console.log(bool);

        if(bool==true)
        {
            item.updateItem(itemName,price,itemDesc,itemId,res,req);
        }else {
            res.render('messageRedir',{background:'red',head:"Ooops!",top:"You are not logged in",lower:"you will be redirected to our haome page." ,redir:"../"});
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
            TwoFA.generate2FAToken(res,req.session.userId,req);
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

router.post('/disable2FA', function (req,res,next){
    var userId = req.body.userId;
    TwoFA.disable2FA(userId,res);
});

router.get('/Search', function (req,res,next){
    var targetName = req.query.name;
    var cat = req.query.cat;
    console.log(!targetName);
    if(targetName&&cat){
        search.searchByNameAndCat(res,req,targetName,cat);
    }
    if(targetName) {
        search.simpleSearch(res, req, targetName);
    }
    if(cat) {
        search.searchByCat(res,req,cat);
    }
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
    var itemID = req.query.ID;
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



router.post("/cmtSub",function (req,res,next) {

    var UserId = req.body.UserId;
    var cmtMsg = req.body.cmtMsg;
    var cmtID = req.body.cmtID;
    console.log(UserId);
    console.log(cmtMsg);
    console.log(cmtID);


    comment.postSubComment(UserId,cmtMsg,cmtID,req,res);
});


router.post("/cmtMain",function (req,res,next) {

    var UserId = req.body.UserId;
    var cmtMsg = req.body.cmtMsg;
    var itemId = req.body.itemId;

        comment.postMainComment(UserId,cmtMsg,itemId,req,res);
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
                req.session.destroy();
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
    console.log(token);
    Email.AuthEmailToken(userID,token,res);
});

router.post('/createItem',function(req,res,next){
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var catId = req.body.catId;
    var price = req.body.price;
    var photoNum = req.body.photoNum;

    createItem.init(res,itemName,catId,price,photoNum,itemDesc);
});


var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/item');
    },
    filename: function (req, file, callback) {
        callback(null,file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
});
var upload = multer({ storage : storage}).single('photo');

router.post('/createItemAjax',upload,function(req,res,next){



    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
    var catId = req.body.cat;
    var price = req.body.price;
    //var photoNum = req.body.photoNum;

    var photoNum =0;
    var itemID=0;
    itemID = item.createItem(itemName,catId,price,photoNum,itemDesc,catId,res,req);
    console.log(itemID);

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
    var PaypalMeLink = req.body.PaypalMeLink;
    var PaypalName = req.body.PaypalName;

    user.CreateUser(res,userName,password,firstName,lastName,addr,telNo,email,location,PaypalMeLink,PaypalName);
});





module.exports = router;
