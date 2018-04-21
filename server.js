var express = require('express');
var router = express.Router();
var app = express();
var port = process.env.PORT || 8000;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var mysql = require('mysql');
var path = require('path');

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var dbconfig = require('./config/database.js');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
require('./config/passport')(connection, passport);


var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage });

// var uploadService = multer({ storage : storage});
// const fileUpload = require('express-fileupload');
// app.use(fileUpload());

app.post('/fileupload', upload.array('selectedFile'), (req, res) => {
	console.log("fuck");
	console.log(req);
      /*
        We now have a new req.file object here. At this point the file has been saved
        and the req.file.filename value will be the name returned by the
        filename() function defined in the diskStorage configuration. Other form fields
        are available here in req.body.
      */
      // res.ssend();
    });

app.use(morgan('dev'));
app.use(cookieParser());

app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.engine('ejs', require('express-ejs-extend'));
// app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

// app.use('/', function(req, res){
// 	res.send('Our First Express program!');
// 	console.log(req.cookies);
// 	console.log('================');
// 	console.log(req.session);
// });

const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});

app.get('/', jwtMW, (req, res) => {
    res.send('You are authenticated'); //Sending some response when authenticated
});

// MOCKING DB just for test
let users = [
    {
        id: 1,
        username: 'test',
        password: 'asdf123'
    },
    {
        id: 2,
        username: 'test2',
        password: 'asdf12345'
    }
];

// LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Use your DB ORM logic here to find user and compare password
    for (let user of users) { // I am using a simple array users which i made above
        if (username == user.username && password == user.password /* Use your password hash checking logic here !*/) {
            //If all credentials are correct do this
            let token = jwt.sign({ id: user.id, username: user.username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
            res.json({
                sucess: true,
                err: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                sucess: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }
    }
});

app.post('/local', function(req, res){
    console.log(req.body);
    var data = req.body;
    var insertData = [];
    for (let [key, value] of Object.entries(data)) {
       insertData.push(value);
    }
    console.log(insertData);
    console.log("loooooooo");
    connection.query(
        "INSERT INTO users ( username, password, provider, first_name, last_name, email ) values (?,?,?,?,?,?)",
        insertData,
        function(err, rows){
            if(err) throw err;

            let token = jwt.sign({ username : data.username , password: data.password }, 'keyboard cat 4 ever', { expiresIn: 600 });
            res.json({
                sucess: true,
                err: null,
                token
            });
        }
    );

});

var apiRouter  = express.Router();
require('./routes/api')(apiRouter, connection, passport)
app.use('/api',apiRouter);

var authRouter  = express.Router();
require('./routes/auth.js') (authRouter, connection, passport, upload);
app.use('/auth', authRouter);


var uploadRouter = express.Router();
require('./routes/upload.js') (uploadRouter, connection, passport, upload)
app.use('/upload', uploadRouter);


var foodRouter = express.Router();
require('./routes/food.js') (foodRouter, connection, passport, upload)
app.use('/food', foodRouter);

// app.use('/', require('./routes/index.js'));

var userRouter = express.Router();
require('./routes/user.js') (userRouter, connection);
app.use('/user', userRouter);

app.listen(port);

console.log('Server running on port ' + port);



// var mongoose = require('mongoose');
// mongoose.connect(configDB.url);
