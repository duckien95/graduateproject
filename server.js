var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');


var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var uploadMulter = multer({ storage: storage })

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.engine('ejs', require('express-ejs-extend'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// app.use('/', function(req, res){
// 	res.send('Our First Express program!');
// 	console.log(req.cookies);
// 	console.log('================');
// 	console.log(req.session);
// });

var auth = express.Router();
require('./routes/auth.js') (auth, passport);
app.use('/auth', auth);

var uploadRouter = express.Router();
require('./routes/upload.js') (uploadRouter, passport, uploadMulter)
app.use('/upload', uploadRouter);

app.use('/', require('./routes/index.js'));

app.listen(port);

console.log('Server running on port: ' + port);