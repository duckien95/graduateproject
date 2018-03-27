var User = require('../app//models/User');
var Image = require('../app/models/Image');

//localhost:8000/auth
module.exports = function(router, passport){

	router.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/auth/profile',
		failureRedirect: '/auth/login',
		failureFlash: true
	}));

	router.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	router.post('/signup', 
		passport.authenticate('local-signup', {
			successRedirect: '/',
			failureRedirect: '/auth/signup',
			failureFlash: true
		})
	);

	router.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', { user: req.user });
	});

	router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

	router.get('/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/auth/profile',
	                                      failureRedirect: '/' }));

	router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	router.get('/google/callback', 
	  passport.authenticate('google', { successRedirect: '/auth/profile',
	                                      failureRedirect: '/' }));


	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/auth/login');
}