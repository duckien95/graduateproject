var User = require('../app/models/User');
var Image = require('../app/models/Image');

//localhost:8000/upload
module.exports = function(router, passport, uploadMulter){

	router.get('/', isLoggedIn, function(req, res){
      Image.findOne({'userId' : req.user._id }, function(err, img){
          console.log(JSON.stringify(img, null, 2));
          res.render('form', { img : img });
      });
		
	});

	router.post('/', isLoggedIn, uploadMulter.single('avatar'), function (req, res, next) {
  		// req.file is the `avatar` file
  		// req.body will hold the text fields, if there were any
  		console.log(req.file);
  		console.log(req.user);
 
  		var img = new Image();
  		img.userId = req.user._id;
  		img.fileName = req.file.filename;
  		img.filePath = req.file.path;

  		img.save(function(err){
  			if(err){
  				res.render("ERROR");
  			}
  		});

  		res.redirect('/');


	});



}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/auth/login');
};