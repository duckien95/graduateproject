var User = require('./models/user');
var Image = require('./models/Image');

module.exports = function(app, passport, upload){

	app.get('/', function(req, res){
		res.render('index.ejs');
	});

};
