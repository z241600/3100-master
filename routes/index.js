var express = require('express');
var user = require('../User');
var TwoFA = require('../Enable2FA');
var verifyF2A = require('../verifyF2AToken');
var userDB = require("./userDB");
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//To get GET parameters like xyz.com/?a=1&b=1, use
//req.query.a and req.query.b
//To get POST parameters, use
//var user_id = req.body.VARNAME;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user',function (req,res,next) {

  userDB.printDB(req,res);

});
router.get('/checkUserDup',function (req,res,next) {
    var userName = req.query.userName;
    user.checkUserDup(userName,res);
});
router.get('/enableTwoAuth',function (req,res,next) {
    var UserId = 1;
    TwoFA.init(res,UserId);
});

router.get('/browseRecord', function (req,res,next){
    var itemId = req.body.itemId;
    browseRecord.init(res,itemId);
});

router.get('/idSearch', function (req,res,next){
    var targetID = req.body.targetID;
    idSearch.init(res,targetID);
});

router.get('/priceSearch', function (req,res,next){
    var priceUpperLimit = req.body.priceUpperLimit;
    var priceLowerLimit = req.body.priceLowerLimit;
    priceSearch.init(res,priceUpperLimit, priceLowerLimit);
});

router.get('/categorySearch', function (req,res,next){
    var categoryName = req.body.categoryName;
    categorySearch.init(res,categoryName);
});

router.get('/keywordSearch', function (req,res,next){
    var targetName = req.body.targetName;
    keywordSearch.init(res,targetName);
});

router.get('history', function (req,res,next) {
    var userID = req.body.userID;
    history.init(res,userID);
});

router.get('askForRecommend', function (req,res,next) {
    var userID = req.body.userID;
    askForRecommend.init(res,userID);
});

router.get('/recommend',function (req,res,next){
    //this one need some more followup
    var userID = req.body.userID;
    recommend.init(res,userID);
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
    verifyF2A.init(res,token,secret);
});

router.post('/userLogin',function (req,res,next) {
    var inputUsername = req.body.inputUsername;
    var inputPassword = req.body.inputPassword;
    userLogin.init(res,inputUsername,inputPassword);
});

router.post('/createUser', function (req,res,next){
    var userName = req.body.userName;
    var password = req.body.password;
    var email = req.body.email;
    var addr = req.body.addr;
    var telNo = req.body.telNo;
    var location = req.body.location;
    createUser.init(res,userName,password,email,addr,telNo,location);
});




module.exports = router;
