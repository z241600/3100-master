var express = require('express');
var user = require('../User');
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
module.exports = router;
