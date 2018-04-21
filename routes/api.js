const GOOGLE_MAP_API_KEY = "AIzaSyDLV4DIm4y3o6Bd7GRR725pmocPgzE3zwE";
function googleMapQuery(origin, destination){
	return "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric"
			+ "&origins=" + origin
			+ "&destinations=" + destination
			+ "&key="+ GOOGLE_MAP_API_KEY;
}
var distance = require('google-distance');
distance.apiKey = GOOGLE_MAP_API_KEY;

const axios = require('axios');

module.exports = function(router, connection, passport){

	var CITYLIST = {};
	var DISTRICTLIST = {};
	var STREETLIST = {};
	var CITY = {};
	var DISTRICT = {}
	var STREET = {};
	var CATEGORY = {};
	var DETAIL_CATEGORY = {};
	var RESTAURANT = {};
	var FOODLIST = [];
	var FOODSEARCH = [];
	var FOODCATEGORYLIST = [];


	connection.query(
		'SELECT * FROM cities',
		[],
		function (err, cities, fields) {
			if (err){
				console.log(err);
				return;
			}

			// console.log(cities.length);
			var cityList = [];
			for (var i = 0; i < cities.length; i++) {
				CITY[cities[i].city_id] = {
					city_name: cities[i].city_name
				};

				cityList.push({
					city_id: cities[i].city_id,
					city_name: cities[i].city_name
				});
			}

			CITYLIST = cityList;
			// console.log(CITYLIST);
			console.log('city okkkkk.');
		}
	);

	connection.query(
		'SELECT DISTINCT city_id FROM districts',
		[],
		function(err, cityDistinct, field){
			if(err){
				console.log(err);
				return;
			}


			for(var i=0; i < cityDistinct.length; i++){

				var cityID = cityDistinct[i].city_id;
				STREETLIST[cityID] = {};
				connection.query(
					'SELECT * FROM districts WHERE city_id = ?',
					[cityID],
					function(err, rows, fields){

						if(err){
							console.log(err);
							return;
						}

						var districtList = {};

						var districts = [];

						for(var j=0; j<rows.length; j++){

							var districtId = rows[j].district_id;

							STREETLIST[cityID][districtId] = {};

							districtList[districtId] = {
								district_name : rows[j].district_name
							}

							districts.push({
								district_id : districtId,
								district_name : rows[j].district_name
							});
						}


						DISTRICT[cityID] = {
							city_name: CITY[cityID].city_name,
							district_list : districtList
						};

						DISTRICTLIST[cityID] = districts;

						STREET[cityID] = {
							city_name: CITY[cityID].city_name,
							district_list : districtList
						};



						// console.log(JSON.stringify(DISTRICT));

					}
				)
			}

			console.log("district okkkkk");
		}
	);



	// cityid, districtid, streetid, streetname

	connection.query(
		'SELECT DISTINCT city_id FROM streets',
		[],
		function (err, cityList, fields) {
			if (err){
				console.log('errors : ' +  err);
				return;
			}

			for (var i = 0; i < cityList.length; i++) {

				var cityID = cityList[i].city_id;
				connection.query(
					'SELECT DISTINCT district_id FROM streets WHERE city_id = ?',
					[ cityID ],
					function(err, districtList, fields){
						if(err){
							console.log(err);
							return;
						}

						for(var j=0; j<districtList.length; j ++){
							var districtID = districtList[j].district_id;

							connection.query(
								'SELECT * FROM streets WHERE city_id = ? AND district_id = ?',
								[ cityID,districtID ],
								function(err, rows, fields){
									if(err){
										console.log(err);
										return;
									}

									var districtID = rows[0].district_id;

									var streetList = [];
									var streets = {};
									for(var k=0; k<rows.length; k++){

										streets[rows[k].street_id] = {
											street_name: rows[k].street_name
										}

										streetList.push({
											street_id: rows[k].street_id,
											street_name: rows[k].street_name
										});

									}

									STREET[cityID].district_list[districtID].street_list = streets;

									STREETLIST[cityID][districtID] = streetList;

									console.log('street okkkkk.');

								}

							);

						}

					}
				);

			}


		}
	);

	connection.query('SELECT * FROM category',
		[],
		function(err, cates, fields){
			if (err) {
				throw err;
				return;
			}

			// console.log(cates);

			var cateLits = [];
			for (var i = 0; i < cates.length; i++) {
				cateLits.push({
					cate_id : cates[i].id,
					cate_name: cates[i].cate_name
				});
			}

			CATEGORY = cateLits;
			console.log("category okkkkk");

		}
	);

	connection.query('SELECT DISTINCT id FROM category',
		[],
		function(err, cates, fields){
			if (err) {
				throw err;
				return;
			}

			for (var i = 0; i < cates.length; i++) {
				var cateID =  cates[i].id;
				connection.query('SELECT * FROM detail_category WHERE category_id = ?',
					[cateID],
					function(err, details, fields){
						if(err){
							throw err;
							return;
						}

						// console.log(details);

						if (details.length) {
							var cateDetail = [];

							for (var i = 0; i < details.length; i++) {
								cateDetail.push({
									detail_name: details[i].detail_name,
									detail_id: details[i].id
								});
							}
							DETAIL_CATEGORY[details[0].category_id] = cateDetail;
							console.log("detail category okkkkk");
						}
					}
				);
			}

		}
	);
	var queryAll = "SELECT fos.*,cate.cate_name, rest.restaurant_name, detail.detail_name, usr.username, str.street_name, str.district_name, str.city_name FROM foods AS fos";
	queryAll += " INNER JOIN users AS usr ON fos.owner_id = usr.id";
	queryAll += " INNER JOIN restaurants AS rest ON fos.restaurant_id = rest.restaurant_id";
	queryAll += " INNER JOIN category AS cate ON fos.category_id = cate.id"
	queryAll += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";
	queryAll += " INNER JOIN streets AS str ON fos.street_id = str.street_id AND fos.district_id = str.district_id AND fos.city_id = str.city_id"

	connection.query(queryAll,(err, rows) => {
		if (err) {
			throw err;
		}
		var i = 0;

		console.log(rows.length);
			SequenceQuery("SELECT img.file_id FROM images AS img WHERE img.food_id = ?", rows, i, rows.length, FOODLIST)
			// console.log("i = " + i);
	});

	function DatabaseQuery(query, args){
		return new Promise( (resolve, reject) => {
			connection.query(query, args, (err, rows) => {
				if (err) {
					return reject(err);
				}
				resolve(rows);
			})
		})
	}

	function SequenceQuery(query, rows, index, len, ListName){

		if(index < len){
			return new Promise( (resolve, reject) => {
				DatabaseQuery("SELECT img.file_id FROM images AS img WHERE img.food_id = ?", rows[index].id)
					.then( imageRes => {
						if(imageRes !== undefined){
							let list = [];
							if(imageRes.length){
								// console.log("leng > 0");
								for (var i = 0; i < imageRes.length; i++) {
									for (let [key, value] of Object.entries(imageRes[i])) {
									   list.push(value);
								   	}
								}
							}
							rows[index].imageUrl = list;
						}

						return DatabaseQuery("SELECT vid.file_id FROM videos AS vid WHERE vid.food_id = ?", rows[index].id);
					})
					.then( videoRes => {
							// console.log(videoRes);
							resolve(true);
							let list = [];
							for (var i = 0; i < videoRes.length; i++) {
								for (let [key, value] of Object.entries(videoRes[i])) {
								   list.push(value);
								}
							}
							rows[index].videoUrl = list;
							ListName.push(rows[index]);
						}
					)
				})
				.then(
					res => {
						// console.log(res);
						SequenceQuery(query, rows, index + 1, len, ListName)
					}
				)
		}

	}

	// router.get('/distance', function(req, res){
	// 	distance.get({
	// 	    origin: 'San Francisco, CA',
	// 	    destination: 'Los Angeles, CA',
	// 	    mode: 'bicycling',
	// 	    units: 'imperial'
	// 	},
	// 	function(err, data) {
	// 		if (err) return console.log(err);
	// 		console.log(data);
	// 	});
	// });

	router.post("/food-search", function(req, res){

		FOODSEARCH = [];
		FOODDISTANCE = [];
		console.log("Start");
		console.log(req.body);
		var { districtSelected, streetSelected, distanceSelected, category , detail, content, latitude, longitude } = req.body;
		var city = 1 ;//default HANOI
		console.log("city > 0" + (city > 0));
		console.log("district " + districtSelected +  (districtSelected > 0));
		console.log( "cate : " + category);
		console.log("detail :" + detail);
		var searchQuery = "SELECT fos.id FROM foods AS fos";
		if(parseInt(city) > 0) searchQuery += " WHERE fos.city_id = " + city;
		if(districtSelected > 0) searchQuery += " AND fos.district_id = " + districtSelected;
		if(streetSelected > 0) searchQuery += " AND fos.street_id = " + streetSelected;
		if(category > 0) searchQuery += " AND fos.category_id = " + category;
		if(detail > 0) searchQuery += " AND fos.detail_category_id = " + detail;

		console.log(searchQuery);

		var destinations = "";
		var origin = latitude + ',' + longitude;

		connection.query(searchQuery,(err, rows) => {
			if (err) {
				throw err;
			}
			if(!rows.length){
				console.log('rows = ' + rows.length);
				res.json({
					status: "fail",
					msg: "Không tìm thấy kết quả nào"
				});
				return;
			}
			let listId = [];
			for (let i = 0; i < rows.length; i++) {
				listId.push(rows[i].id);
			}
			for (let j = 0; j < FOODLIST.length; j++) {
				if (listId.includes(FOODLIST[j].id)) {
					// var foli = JSON.stringify(FOODLIST[j]);
					var foli = FOODLIST[j];
					console.log("foli " + j + ': ' + foli.street_name);
					FOODSEARCH.push(foli);
					destinations += foli.street_number + "," + foli.street_name + "," + foli.district_name + "," + foli.city_name + "|";
				}
			}

			// console.log(destinations);
			// var url = googleMapQuery(origin, destinations);
			// router.get(url, function(req, res){
			// 	console.log(res);
			// })
			distance.get({
				origin: origin,
				destination: destinations,
				mode: 'transit',
				units: 'metric'
			},
			function(err, data) {
				if (err) return console.log(err);
				if(distanceSelected < 0){
					for (let i = 0; i < data.length; i++) {
						FOODSEARCH[i].distance = data[i].distance;

						console.log(data[i].distance);
					}

					res.json({
						status: "success",
						data: FOODSEARCH
					});
				}
				else {
					for (let i = 0; i < data.length; i++) {

						var dist = data[i].distance.split(' ')[0];
						if(Number(dist) < Number(distanceSelected)){
							console.log("on");
							FOODSEARCH[i].distance = data[i].distance;
							FOODDISTANCE.push(FOODSEARCH[i]);
						}
					}
					res.json({
						status: "success",
						data: FOODDISTANCE
					});
				}


				// console.log(FOODSEARCH);


				// console.log(data);
			});
			// axios.get(url)
			// .then(res => {
			// 	// console.log(res);
			// 	console.log("suceess");
			// 	// console.log(res.rows[0].length);
			// })
			// .catch(function (error) {
			//    console.log(error)
			//    console.log("fail");
			//  })

		});

	});

	function SequenceCategory(index, len,  CATEGORY, FOODCATEGORYLIST){
		if(index < len){
			// console.log('index = ' + index);
			// console.log("CATEGORY" );
			// console.log(CATEGORY[index]);
			return new Promise( (resolve, reject) => {
				DatabaseQuery("SELECT id FROM foods WHERE category_id = ?", CATEGORY[index].cate_id)
				.then(
					rows =>{
						console.log(rows);
						console.log("i = " + index);
						let data = [];
						let foods = []
						let listId = [];
						for (let i = 0; i < rows.length; i++) {
							listId.push(rows[i].id);
						}

						for (let j = 0; j < FOODLIST.length; j++) {
							if (listId.includes(FOODLIST[j].id)) {
								// console.log('id = ' + FOODLIST[j].id);
								foods.push(FOODLIST[j])
							}
						}

						data.push({
							category_name : CATEGORY[index].cate_name,
							foods : foods
						});
						// console.log(foods);
						FOODCATEGORYLIST.push({
							category_name : CATEGORY[index].cate_name,
							foods : foods
						});

						resolve(true)

					}
				)
			}).then(
				res => {
					// console.log(res);
					SequenceCategory(index + 1, len, CATEGORY, FOODCATEGORYLIST)
				}
			)
		}
	}


	router.get("/food/category-list", function(req, res){

		// console.log(FOODCATEGORYLIST);
		// console.log(CATEGORY);
		var i = 0;
		var len = CATEGORY.length;
		console.log(CATEGORY[i].cate_id);
		SequenceCategory(0, len, CATEGORY, FOODCATEGORYLIST);
		res.json({
			status: "success",
			data: FOODCATEGORYLIST
		});


	})

	router.get("/food-category/:id", function(req, res){
		var categoryId = req.params.id;
		console.log(categoryId);
		var query = "SELECT fos.id FROM foods AS fos WHERE fos.category_id = " + categoryId;
		connection.query(query,(err, rows) => {
			if (err) {
				throw err;
			}
			let listId = [];
			let data = [];
			for (let i = 0; i < rows.length; i++) {
				listId.push(rows[i].id);
			}

			for (let j = 0; j < FOODLIST.length; j++) {
				if (listId.includes(FOODLIST[j].id)) {
					data.push(FOODLIST[j])
				}
			}
			res.json({
				status: "success",
				data: data
			});
		});

	})


	router.get("/food-nearby/:place", function(req, res){
		console.log(req.params);
		var NEARBY = [];
		var origin = req.params.place;
		var destinations = "";
		for (var i = 0; i < FOODLIST.length; i++) {
			var foli = FOODLIST[i];
			destinations += foli.street_number + "," + foli.street_name + "," + foli.district_name + "," + foli.city_name + "|";
		}

		distance.get({
			origin: origin,
			destination: destinations,
			mode: 'transit',
			units: 'metric'
		},
		function(err, data) {
			if (err) return console.log(err);
			for (let i = 0; i < data.length; i++) {
				var distance = data[i].distance;
				if(distance.split(" ")[0] < 3){
					var foli = FOODLIST[i];
					foli.distance = distance;
					NEARBY.push(foli);
				}

				console.log(data[i].distance);
			}

			// console.log(FOODSEARCH);

			res.json({
				status: "success",
				data: NEARBY
			});
			// console.log(data);
		});
	});


	router.get('/like-favorite/:food_id/:user_id', function(req, res){
		console.log(req.params);
		const {food_id, user_id } = req.params;
		console.log("user_id = " + user_id);
		// var user_id =req.params.user_id;
		// var food_id = req.params.user_id;
		var like = false;
		var favorite = false;
		connection.query('SELECT * FROM likes WHERE food_id = ? AND user_id = ?  ', [food_id, user_id], (err, rows) => {
			if(err) throw err;
			if(rows.length){
				like = true;
			}
			connection.query('SELECT * FROM favorites WHERE food_id = ?  AND user_id = ? ',[food_id, user_id], (err, rows) => {
				if(err) throw err;
				if(rows.length){
					favorite = true;
				}

				res.json({
					like : like,
					favorite: favorite
				})

			})
		})
	})




	router.get("/food/:id", function (req, res){
		// console.log(req.params.id);
		// console.log(FOODLIST[3].id);

		// for (let j = 0; j < FOODLIST.length; j++) {
		// 	if (req.params.id === FOODLIST[j].id) {
		// 		console.log(req.params.id === FOODLIST[j].id);
		// 		// res.status(200).json({
		// 		// 	status: "success",
		// 		// 	data: FOODLIST[j]
		// 		// })
		// 	}
		// }

		var foodData = [];
		var foodId = req.params.id;
		console.log(foodId);
		var query = "SELECT fos.*,cate.cate_name, rest.restaurant_name, detail.detail_name, usr.username,str.street_name, str.district_name, str.city_name FROM foods AS fos";
		query += " INNER JOIN users AS usr ON fos.owner_id = usr.id";
		query += " INNER JOIN restaurants AS rest ON fos.restaurant_id = rest.restaurant_id";
		query += " INNER JOIN category AS cate ON fos.category_id = cate.id";
		query += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";
		// query += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";
		query += " INNER JOIN streets AS str ON fos.street_id = str.street_id AND fos.district_id = str.district_id AND fos.city_id = str.city_id";

		query +=  " WHERE fos.id = " + foodId;

		DatabaseQuery(query).then(
			res => {
				foodData = res[0];
				return DatabaseQuery("SELECT img.file_id FROM images AS img WHERE img.food_id = ?", foodId);
			}
		).then(
			imageRes => {
				// console.log(imageRes);
				let list = [];
				for (var i = 0; i < imageRes.length; i++) {
					for (let [key, value] of Object.entries(imageRes[i])) {
					   list.push(value);
					   // list[i] = value;
					}
				}
				foodData.imageUrl = list;
				return DatabaseQuery("SELECT vid.file_id FROM videos AS vid WHERE vid.food_id = ?", foodId);
			}
		)
		.then(
			videoRes => {
				let list = [];
				for (var i = 0; i < videoRes.length; i++) {
					for (let [key, value] of Object.entries(videoRes[i])) {
					   list.push(value);
					}
				}
				foodData.videoUrl = list;

				res.status(200).json({
					status: "success",
					data: foodData
				})
			}
		)
	})

	router.get("/food-list", function(req, res){
		res.status(200).json({
			status: 'success',
			foods : FOODLIST
		});
	});

	router.get('/cities', function (req, res) {
		res.status(200).json({
			status: 'success',
			cities: CITY
		})
	});


	router.get("/city/list", function(req, res){
		res.status(200).json({
			status: 'success',
			data : CITYLIST,

		})
	});

	router.get('/districts', function (req, res){
		res.status(200).json({
			status: 'success',
			data: DISTRICT
		})
	});


	router.get('/district/list', function (req, res){
		res.status(200).json({
			status: 'success',
			data: DISTRICTLIST
		})
	});

	router.get('/streets', function (req, res){
		res.status(200).json({
			status: 'success',
			data: STREET
		})
	});

	router.get('/street/list', function (req, res){
		res.status(200).json({
			status: 'success',
			data: STREETLIST
		})
	});

	router.get("/category", function (req, res){
		res.status(200).json({
			status: "success",
			data: CATEGORY
		})
	})

	router.get("/category/detail", function (req, res){
		res.status(200).json({
			status: "success",
			data: DETAIL_CATEGORY
		})
	})
}
