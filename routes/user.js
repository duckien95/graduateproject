const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
// var router = require('express').Router();
module.exports = function(router, connection){
    router.post("/create", function(req, res){
        console.log(req.body);
        // res.render("form.ejs")
        console.log("fuck");
    });
}
