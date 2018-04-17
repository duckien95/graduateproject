var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('./auth');
// var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
// var dbconfig = require('./database.js');
// var connection = mysql.createConnection(dbconfig.connection);

// connection.query('USE ' + dbconfig.database);



module.exports = function(connection, passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
	});


	passport.use('local-signup', 

		new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			fullNameFiels: 'fullName',
			passReqToCallback: true
		},

		function(req, username, password, done){

			 // console.log(JSON.stringify(req.body, null, 2));

				// var emailIsValid = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(username);
				// var phoneIsValid = /^(01[2689]|09|08)\d{8}/.test(req.body.phone);

				// if(emailIsValid && phoneIsValid){

				// }

				// else {
				// 	if(!emailIsValid){
				// 		if(!phoneIsValid){
				// 			return done(null, false, req.flash('signupMessage', 'Email and phone number is not valid'));
				// 		}

				// 		return done(null, false, req.flash('signupMessage', 'Email is not valid'));

				// 	}

				// 	return done(null, false, req.flash('signupMessage', 'Phone number is not valid'));
					
				// }

			connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {

				if (err)
                	return done(err);
                
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'Tên đăng nhập đã tồn tại.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUser = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    connection.query(insertQuery,[newUser.username, newUser.password],function(err, rows) {

                        newUser.id = rows.insertId;

                        return done(null, newUser);
                    });
                }
			})
		})
	);

	passport.use('local-login', 

		new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},

		function(req, username, password, done){

			connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'Không tồn tại tên đăng nhập')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Mât khẩu không đúng xin mời nhập lại')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });		
		}
	));


	passport.use(
		new FacebookStrategy({
	    	clientID: configAuth.facebookAuth.clientID,
	    	clientSecret: configAuth.facebookAuth.clientSecret,
	    	callbackURL: configAuth.facebookAuth.callbackURL
			},
	  		function(accessToken, refreshToken, profile, done) {
	  			connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){

	    			if(err)
	    				return done(err);
	    			if(rows.length)
	    				return done(null, rows[0]);
	    			else {

	    				var newUser = {
                        	username: username,
                        	password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
	                    };

	                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

	                    connection.query(insertQuery,[newUser.username, newUser.password],function(err, rows) {

	                        newUser.id = rows.insertId;

	                        return done(null, newUser);
	                    });
	    				// var newUser = new User();
	    				// newUser.facebook.token = accessToken;
	    				// newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    				// newUser.facebook.email = profile.emails[0].value;

	    				// newUser.save(function(err){
	    				// 	if(err)
	    				// 		throw err;
	    				// 	return done(null, newUser);
	    				// })
	    				// console.log(profile);
	    			}
	    	});
	    }

	));


	// GMAIL LOGIN 
	passport.use(new GoogleStrategy({
	    	clientID: configAuth.googleAuth.clientID,
	    	clientSecret: configAuth.googleAuth.clientSecret,
	    	callbackURL: configAuth.googleAuth.callbackURL
	  	},
	  	function(accessToken, refreshToken, profile, done) {

	  		var username = profile.emails[0].value;
			connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){

				if(err)
					return done(err);
				if(rows.length)
					return done(null, rows[0]);
				else {

					var newUser = {
	                	username: username,
	                	password: bcrypt.hashSync(null, null, null)  // use the generateHash function in our user model
	                };

	                var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

	                connection.query(insertQuery,[newUser.username, newUser.password],function(err, rows) {

	                    newUser.id = rows.insertId;
	                    // console.log(JSON.stringify(err, null, 2));
	                    // console.log(JSON.stringify(rows, null, 2));

	                    return done(null, newUser);
	                });

					// newUser.google.id = profile.id;
					// newUser.google.token = accessToken;
					// newUser.google.name = profile.displayName;
					// newUser.google.email = profile.emails[0].value;
				}
			});
	    }

	));

};