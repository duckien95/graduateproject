

module.exports = function(app, passport, upload){

	app.get('/', function(req, res){
		res.render('index.ejs');
	});

};
