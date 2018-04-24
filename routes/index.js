var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/search', function(req, res, next) {
    console.log(req.body);
});


router.post('/test', function(req, res){
    var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=105+Quán+Thánh+Ba+Đình+Hà+Nội&destinations=106+A7+Ngõ+A1+Tôn+Thất+Tùng+Đống Đa+Hà Nội&key=AIzaSyAPiN-8Q1QKqw4-tqwogebchry4_lIn97E';

    axios.get(url)
    .then(res => {
        console.log(res);
    })
    .catch(
        err => {
            console.log(err);
        }
    )
})
module.exports = router;
