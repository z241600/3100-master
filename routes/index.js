var express = require('express');
var user = require('../User');
var TwoFA = require('../2FA');
var userDB = require("./userDB");
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
    secret: 'csci3100 proj',
    cookie: { maxAge: 60 * 1000 }
}));
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
    TwoFA.generate2FAToken(res,UserId);
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
    TwoFA.verify2FASecrete(res,token,secret);
});

router.post('/userLogin',function (req,res,next) {
    var inputUsername = req.body.inputUsername;
    var inputPassword = req.body.inputPassword;
    LoginUser.init(res,inputUsername,inputPassword);
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
