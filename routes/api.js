const GOOGLE_MAP_API_KEY = "AIzaSyDLV4DIm4y3o6Bd7GRR725pmocPgzE3zwE";
// const GOOGLE_MAP_API_KEY = 'AIzaSyAPiN-8Q1QKqw4-tqwogebchry4_lIn97E';
function googleMapQuery(origin, destination){
	return "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric"
			+ "&origins=" + origin
			+ "&destinations=" + destination
			+ "&key="+ GOOGLE_MAP_API_KEY;
}
var distance = require('google-distance');
distance.apiKey = GOOGLE_MAP_API_KEY;

const axios = require('axios');
var mysql = require('mysql');

module.exports = function(router, connection){

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

	router.post('/change-permission/:userid/:permiss', function(req, res) {
		const { userid, permiss } = req.params;
		console.log(req.params);
		console.log(userid);
		console.log(permiss);
		connection.query('update users set type = ? where id = ?',
			[permiss, userid],
			(err, row) => {
				if (err) {
					throw err;
				}
				res.status(200).json({
					status : 'success'
				})
			}
		)
	})

	var queryRestaurant = 'select distinct(res.restaurant_name) from restaurants as res';

	router.get('/restaurant-list', function(req, res){
		var RESTAURANTS = [];
		connection.query(queryRestaurant, (err, rows) => {
			if (err) {
				throw err;
			}

			SequenceRestaurantQuery(rows, 0, rows.length, RESTAURANTS, res);

		});
	})

	function SequenceRestaurantQuery(rows, index, len, ListName, response){
		// console.log('line 296');
		if(index < len){
			var row = rows[index];

			// return new Promise( (resolve, reject) => {
				DatabaseQuery('select res.*, str.street_name, str.district_name, str.city_name  from restaurants as res inner join streets as str on str.id = res.address_id where res.restaurant_name = ?',row.restaurant_name)
				.then(
					res => {
						// console.log('res.length = ' + res.length);
						var list = [];
						for (var i = 0; i < res.length; i++) {
							list.push(res[i].street_name + ', ' + res[i].district_name + ', ' + res[i].city_name);
						}
						// console.log('line 313');
						// console.log('length of address = ' + res.length);
						row.address = list;
						row.foods = [];
						ListFoodInRestaurant(res, 0, res.length, row, ListName);
					}
				).then(
					res => {
						SequenceRestaurantQuery(rows, index + 1, len, ListName, response)
					}
				)
			// })

		}
		else {
			response.json({
				status : 'sucess',
				data : ListName
			})
		}
	}

	function ListFoodInRestaurant(res, index, len, row, ListName){
		if(index < len){
			var resp = res[index];
			return new Promise( (resolve, reject) => {
				DatabaseQuery("SELECT fos.id, fos.name FROM foods AS fos where fos.restaurant_id = ?", resp.restaurant_id)
				.then(
					result => {
						// console.log('result of index ' + res.length);
						// console.log(result);
						let list = {};
						list.address = resp.street_name + ', ' + resp.district_name + ', ' + resp.city_name;
						// list.push();
						list.food_in_address = [];
						for (var i = 0; i < result.length; i++) {
							list.food_in_address.push({
								food_id : result[i].id,
								food_name :  result[i].name
							})
						}
						// console.log(list);

						row.foods.push(list);
					}
				).then(
					result => {
						// console.log('next TestREstaurant');
						ListFoodInRestaurant(res, index + 1, len, row, ListName)
					}
				)
			})
		}
		else{
			// console.log('index = len in test');
			ListName.push(row);
		}
	}


	// var RESTAURANTLIST = [];
	// var queryRestaurant = 'select res.*, str.street_name, str.district_name, str.city_name  from restaurants as res inner join streets as str on str.id = res.address_id';

	// router.get('/restaurant-list', function(req, res){
	//
	// 	connection.query(queryRestaurant, (err, rows) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		console.log(rows.length);
	// 		var i = 0;
	// 		SequenceRestaurantQuery(rows, i, rows.length, RESTAURANTLIST)
	//
	// 		res.status(200).json({
	// 			status : 'sucess',
	// 			data : RESTAURANTLIST
	// 		})
	// 	})
	//
	// });

	// connection.query(queryRestaurant, (err, rows) => {
	// 	if (err) {
	// 		throw err;
	// 	}
	// 	// console.log(rows);
	// 	// console.log(rows.length);
	// 	SequenceRestaurantQuery(rows, 0, rows.length, RESTAURANTLIST);
	// });
	//
	// function SequenceRestaurantQuery(rows, index, len, ListName){
	// 	// console.log('index restaurants = ' + index);
	// 	if(index < len){
	// 		var row = rows[index];
	// 		row.address = row.street_name + ', ' + row.district_name + ', ' + row.city_name;
	// 		return new Promise( (resolve, reject) => {
	// 			DatabaseQuery("SELECT fos.id, fos.name FROM foods AS fos where fos.restaurant_id = ?", row.restaurant_id)
	// 				.then( fos => {
	// 					// console.log('line 284');
	// 					// console.log(fos);
	// 					if(fos !== undefined){
	// 						let list = [];
	// 						if(fos.length){
	// 							// console.log("leng > 0");
	// 							for (var i = 0; i < fos.length; i++) {
	// 								list.push({
	// 									food_id : fos[i].id,
	// 									food_name : fos[i].name,
	// 								});
	// 							}
	// 						}
	// 						row.foods = list;
	// 						ListName.push(row);
	// 					}
	//
	// 				}).then(
	// 					res => {
	// 						return SequenceRestaurantQuery(rows, index + 1, len, ListName);
	// 					}
	// 				)
	// 			}
	// 		)
	// 	}
	// }


	router.get('/user-list', function(req, res){

		var USERLIST = [];
		var queryUser = 'select * from users';
		// queryUser += ' inner join foods as fos on fos.id = likes.food_id';
		connection.query(queryUser, (err, rows) => {
			if (err) {
				throw err;
			}
			// console.log(rows.length);
			SequenceUserQuery(rows, 0, rows.length, USERLIST, res);
		});

	});

	router.get('/user/:user_id', function(req, res){

		var USERLIST = [];
		// queryUser += ' inner join foods as fos on fos.id = likes.food_id';
		connection.query('select * from users where id = ?', req.params.user_id, (err, rows) => {
			if (err) {
				throw err;
			}
			// console.log(rows.length);
			res.json({
				status: 'success',
				data: rows[0]
			})
		});

	});

	function SequenceUserQuery(rows, index, len, ListName, response){
		console.log('index user = ' + index);
		if(index < len){
			var row = rows[index];
			// return new Promise( (resolve, reject) => {
				DatabaseQuery("SELECT fos.id, fos.name FROM foods AS fos inner join likes on likes.food_id = fos.id where likes.user_id = ?", row.id)
					.then( fos => {
						// console.log('line 284');
						// console.log(fos);
						if(fos !== undefined){
							let list = [];
							if(fos.length){
								// console.log("leng > 0");
								for (var i = 0; i < fos.length; i++) {
									list.push(fos[i]);
								}
							}
							row.like = list;
						}

						return DatabaseQuery("SELECT fos.id, fos.name FROM foods AS fos inner join favorites on favorites.food_id = fos.id where favorites.user_id = ?", row.id);
					})
					.then(
						fos => {
							// console.log('line 300');
							if(fos !== undefined){
								let list = [];
								if(fos.length){
									// console.log("leng > 0");
									for (var i = 0; i < fos.length; i++) {
										list.push(fos[i]);
									}
								}
								row.favorite = list;
								// ListName.push(row);
							}
							// return true;
							return DatabaseQuery("SELECT fos.id, fos.name FROM foods AS fos where fos.owner_id = ?", row.id);
						}
					).then(
						fos => {
							if(fos !== undefined){
								let list = [];
								if(fos.length){
									// console.log("leng > 0");
									for (var i = 0; i < fos.length; i++) {
										list.push(fos[i]);
									}
								}
								row.post = list;
								ListName.push(row);
							}
						}
					).then(
						res => {
							return SequenceUserQuery(rows, index + 1, len, ListName, response);
						}
					)
			// 	}
			// )
		} else {
			response.json({
				status : 'success',
				data : ListName
			})
		}
	}




		var queryAll = "SELECT fos.*,cate.cate_name, rest.restaurant_name, usr.username, usr.first_name, usr.last_name, str.street_name, str.district_name, str.city_name FROM foods AS fos";
	// var queryAll = "SELECT fos.*,cate.cate_name, rest.restaurant_name, detail.detail_name, usr.username, usr.first_name, usr.last_name, str.street_name, str.district_name, str.city_name FROM foods AS fos";
	queryAll += " INNER JOIN users AS usr ON fos.owner_id = usr.id";
	queryAll += " INNER JOIN restaurants AS rest ON fos.restaurant_id = rest.restaurant_id";
	queryAll += " INNER JOIN category AS cate ON fos.category_id = cate.id"
	// queryAll += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";
	queryAll += " INNER JOIN streets AS str ON fos.street_id = str.street_id AND fos.district_id = str.district_id AND fos.city_id = str.city_id";
	// queryAll += " WHERE fos.status = ? ";
	// var pending = 'pending';
	// var approve = 'approve'
	// var queryApprove = queryAll + ' WHERE fos.status = ? ' + mysql.escape('pending');

	connection.query(queryAll,(err, rows) => {
		if (err) {
			throw err;
		}

		ConstSequenceQuery( rows, 0, rows.length, FOODLIST)

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

	router.get("/testfood", function(req, res){
		console.log('start');
		var FOST = [];

		DatabaseQuery(queryAll,)
		.then(
			rows => {
				// console.log('aaaaaaaaaaaaaaaaa');
				TestSequence(rows, 0, rows.length, FOST, res);

				// console.log('FOST = ' + FOST.length);

			}

		)



	});


	function TestSequence(rows, index, len, ListName, res){

			if(index < len){
				console.log('index = ' + index);
				var row = rows[index];
				row.address = row.street_name + ', ' + row.district_name + ', ' + row.city_name;
				row.owner_name = row.username == null ? (row.first_name + ' ' + row.last_name) : row.username;

					DatabaseQuery("SELECT img.file_id, img.status FROM images AS img WHERE img.food_id = ?", row.id)
						.then( imageRes => {
							if(imageRes !== undefined){
								let list = {};
								list.pending = [];
								list.approve = [];
								if(imageRes.length){
									// console.log("leng > 0");
									for (var i = 0; i < imageRes.length; i++) {
										var img = imageRes[i];
										if (img.status === "pending") {
											list.pending.push(img.file_id);
										} else {
											list.approve.push(img.file_id);
										}

									}
								}
								row.imageUrl = list;
							}

							return DatabaseQuery("SELECT vid.file_id FROM videos AS vid WHERE vid.food_id = ?", row.id);
						})
						.then( videoRes => {
								// console.log(videoRes);

								let list = {};
								list.pending = [];
								list.approve = [];
								for (var i = 0; i < videoRes.length; i++) {
									var video = videoRes[i];
									if (video.status === "pending") {
										list.pending.push(video.file_id);
									} else {
										list.approve.push(video.file_id);
									}
								}
								row.videoUrl = list;

								ListName.push(row);
								return DatabaseQuery("SELECT vid.file_id FROM videos AS vid WHERE vid.food_id = ?", row.id);
							}
						)
						.then(
							resp =>  {
								console.log(resp);
								TestSequence(rows, index + 1, len, ListName, res)
							}
						)



			}
			else {
				console.log('end lopp');

				res.json({
					status : 'success',
					data : ListName
				})

				// return new Promise((resolve, reject) => {
				// 	resolve(ListName);
				// })
				// console.log(ListName[15].id);

			}

	}

	function ConstSequenceQuery( rows, index, len, ListName){

		if(index < len){
			var row = rows[index];
			row.address = row.street_name + ', ' + row.district_name + ', ' + row.city_name;
			row.owner_name = row.username == null ? (row.first_name + ' ' + row.last_name) : row.username;

			// return new Promise( (resolve, reject) => {
				DatabaseQuery("SELECT img.file_id, img.status FROM images AS img WHERE img.food_id = ?", row.id)
					.then( imageRes => {
						if(imageRes !== undefined){
							let list = {};
							list.pending = [];
							list.approve = [];
							if(imageRes.length){
								// console.log("leng > 0");
								for (var i = 0; i < imageRes.length; i++) {
									var img = imageRes[i];
									if (img.status === "pending") {
										list.pending.push(img.file_id);
									} else {
										list.approve.push(img.file_id);
									}

								}
							}
							row.imageUrl = list;
						}

						return DatabaseQuery("SELECT vid.file_id FROM videos AS vid WHERE vid.food_id = ?", row.id);
					})
					.then( videoRes => {
							// console.log(videoRes);

							let list = {};
							list.pending = [];
							list.approve = [];
							for (var i = 0; i < videoRes.length; i++) {
								var video = videoRes[i];
								if (video.status === "pending") {
									list.pending.push(video.file_id);
								} else {
									list.approve.push(video.file_id);
								}
							}
							row.videoUrl = list;
							return DatabaseQuery('select usr.username, usr.first_name, usr.last_name, usr.id from users as usr inner join likes on likes.user_id = usr.id where likes.food_id = ?',row.id );
							// ListName.push(row);
						}
					).then(
						res => {
							if(res !== undefined){
								let list = [];
								if(res.length){
									// console.log("leng > 0");

									for (var i = 0; i < res.length; i++) {
										if(res[i].username === null){

										}
										let user = res[i];
										list.push({
											user_id : user.id,
											username : user.username === null ? (user.first_name + ' ' + user.last_name) : user.username
										});
									}
								}
								row.like = list;
								// ListName.push(row);
							}
							return DatabaseQuery('select usr.username, usr.first_name, usr.last_name, usr.id from users as usr inner join favorites on favorites.user_id = usr.id where favorites.food_id = ?',row.id );
						}
					).then(
						res => {
							if(res !== undefined){
								let list = [];
								if(res.length){
									// console.log("leng > 0");
									for (var i = 0; i < res.length; i++) {
										let user = res[i];
										list.push({
											user_id : user.id,
											username : user.username === null ? (user.first_name + ' ' + user.last_name) : user.username
										});
									}
								}
								row.favorite = list;
								ListName.push(row);
							}
						}
					)
					.then(
						res => {
							// console.log(res);
							ConstSequenceQuery( rows, index + 1, len, ListName)
						}
					)
			// 	}
			// )
		}


	}


	function SequenceQuery( rows, index, len, ListName, response){

		if(index < len){
			var row = rows[index];
			row.address = row.street_name + ', ' + row.district_name + ', ' + row.city_name;
			row.owner_name = row.username == null ? (row.first_name + ' ' + row.last_name) : row.username;

			// return new Promise( (resolve, reject) => {
				DatabaseQuery("SELECT img.file_id, img.status FROM images AS img WHERE img.food_id = ?", row.id)
					.then( imageRes => {
						if(imageRes !== undefined){
							let list = {};
							list.pending = [];
							list.approve = [];
							if(imageRes.length){
								// console.log("leng > 0");
								for (var i = 0; i < imageRes.length; i++) {
									var img = imageRes[i];
									if (img.status === "pending") {
										list.pending.push(img.file_id);
									} else {
										list.approve.push(img.file_id);
									}

								}
							}
							row.imageUrl = list;
						}

						return DatabaseQuery("SELECT vid.file_id FROM videos AS vid WHERE vid.food_id = ?", row.id);
					})
					.then( videoRes => {
							// console.log(videoRes);

							let list = {};
							list.pending = [];
							list.approve = [];
							for (var i = 0; i < videoRes.length; i++) {
								var video = videoRes[i];
								if (video.status === "pending") {
									list.pending.push(video.file_id);
								} else {
									list.approve.push(video.file_id);
								}
							}
							row.videoUrl = list;
							return DatabaseQuery('select usr.username, usr.first_name, usr.last_name, usr.id from users as usr inner join likes on likes.user_id = usr.id where likes.food_id = ?',row.id );
							// ListName.push(row);
						}
					).then(
						res => {
							if(res !== undefined){
								let list = [];
								if(res.length){
									// console.log("leng > 0");

									for (var i = 0; i < res.length; i++) {
										if(res[i].username === null){

										}
										let user = res[i];
										list.push({
											user_id : user.id,
											username : user.username === null ? (user.first_name + ' ' + user.last_name) : user.username
										});
									}
								}
								row.like = list;
								// ListName.push(row);
							}
							return DatabaseQuery('select usr.username, usr.first_name, usr.last_name, usr.id from users as usr inner join favorites on favorites.user_id = usr.id where favorites.food_id = ?',row.id );
						}
					).then(
						res => {
							if(res !== undefined){
								let list = [];
								if(res.length){
									// console.log("leng > 0");
									for (var i = 0; i < res.length; i++) {
										let user = res[i];
										list.push({
											user_id : user.id,
											username : user.username === null ? (user.first_name + ' ' + user.last_name) : user.username
										});
									}
								}
								row.favorite = list;
								ListName.push(row);
							}
						}
					)
					.then(
						res => {
							// console.log(res);
							SequenceQuery( rows, index + 1, len, ListName, response)
						}
					)
			// 	}
			// )
		}
		else{
			response.json({
				status: 'success',
				foods : ListName
			})
		}

	}

	function StandardString(str){
		str= str.toLowerCase();
		str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
		str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
		str= str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
		str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
		str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
		str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
		str= str.replace(/đ/g, "d");
		str= str.replace('/', '+');
		return str;
	}

	router.get('/distance', function(req, resp){

		var origin = "167 ngo 1A ton that tung, dong da, ha noi";
		// var dest = "105 quan thanh, ba dinh, viet nam";
		var dest = '354,Lạc Trung,Hai Bà Trưng,Hà Nội|Số 254,Bạch Mai,Hai Bà Trưng,Hà Nội|241,Trần Đại Nghĩa,Hai Bà Trưng,Hà Nội|24,Lê Văn Hưu,Hoàn Kiếm,Hà Nội|Số 27 Ngõ 29,Hàng Khay,Hoàn Kiếm,Hà Nội|19A, ngõ 9,Trần Quốc Hoàn,Cầu Giấy,Hà Nội|179,Huế,Hai Bà Trưng,Hà Nội|179,Huế,Hai Bà Trưng,Hà Nội|Số 1/96, Ngõ Tự Do,Trần Đại Nghĩa,Hai Bà Trưng,Hà Nội|482,Xã Đàn,Đống Đa,Hà Nội|53A,Hàng Bài,Hoàn Kiếm,Hà Nội|215,Trần Đại Nghĩa,Hai Bà Trưng,Hà Nội|257,Giảng Võ,Đống Đa,Hà Nội|17 Ngõ Gạch,Hàng Buồm,Hoàn Kiếm,Hà Nội|K3B,Tạ Quang Bửu,Hai Bà Trưng,Hà Nội|105,Quán Thánh,Ba Đình,Hà Nội|Ngõ 74,Hàng Quạt,Hoàn Kiếm,Hà Nội|47,Đào Duy Từ,Hoàn Kiếm,Hà Nội|Số  6, Ngõ 139,Khương Thượng,Đống Đa,Hà Nội|244 ,Bạch Mai,Hai Bà Trưng,Hà Nội|106 A7, Ngõ A1,Tôn Thất Tùng,Đống Đa,Hà Nội|301,Tô Hiệu,Cầu Giấy,Hà Nội|117,Trần Đại Nghĩa,Hai Bà Trưng,Hà Nội|13,Lò Đúc,Hai Bà Trưng,Hà Nội|229,Trần Đại Nghĩa,Hai Bà Trưng,Hà Nội|Nhà T8, Khu tập thể Kinh Tế Quốc Dân,Ngõ Tự Do, Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội';



		// console.log(googleMapQuery(origin, dest));
		// var url = googleMapQuery(origin, dest);
		// url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&key=AIzaSyAPiN-8Q1QKqw4-tqwogebchry4_lIn97E';
		var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origin + '&destinations=' + StandardString(dest) + '&key=AIzaSyAPiN-8Q1QKqw4-tqwogebchry4_lIn97E';

		console.log(url);

		// axios.get(url)
		// .then(
		// 	res => {
		// 		// resp.json({
		// 		// 	data : JSON.stringify(res)
		// 		// })
		// 		// console.log(res);
		// 		console.log(JSON.stringify(res.data.rows));
		// 		// console.log(res[0].data);
		// 		resp.json({
		// 			data : res.data.rows
		// 		});
		// 		console.log('success');
		// 	}
		// ).catch(
		// 	err => {
		// 		// resp.send(err);
		// 		console.log(err);
		// 		// console.log('errr');
		// 	}
		// )
		distance.get({
			origin: origin,
			destination: StandardString(dest),
			mode: 'transit',
			units: 'metric'
		},
		function(err, data) {
			if (err) return console.log(err);
			console.log(data);
			resp.json({
				data : data
			});
		});
	});



	router.post("/food-search", function(req, res){

		FOODSEARCH = [];
		FOODDISTANCE = [];
		console.log(req.body);
		var { districtSelected, streetSelected, distanceSelected, category , detail, content, latitude, longitude } = req.body;
		var city = 1 ;//default HANOI
		console.log("city > 0" + (city > 0));
		console.log("district " + districtSelected +  (districtSelected > 0));
		console.log( "cate : " + category);
		console.log("detail :" + detail);
		console.log('content vs null ' + (content !== null));
		if(content){
			console.log('content not null');
		}
		var searchQuery = "SELECT fos.id FROM foods AS fos";
		if(parseInt(city) > 0) searchQuery += " WHERE fos.city_id = " + city;
		if(districtSelected > 0) searchQuery += " AND fos.district_id = " + districtSelected;
		if(streetSelected > 0) searchQuery += " AND fos.street_id = " + streetSelected;
		if(category > 0) searchQuery += " AND fos.category_id = " + category;
		if(detail > 0) searchQuery += " AND fos.detail_category_id = " + detail;

		// console.log(searchQuery);

		var destinations = "";
		var origin = latitude + ',' + longitude;

		if(content.length){
			console.log('content is ' + content);
			connection.query('SELECT id FROM foods WHERE MATCH(name, description, prices) AGAINST( ? IN NATURAL LANGUAGE MODE )', content, (err, rows) => {
				if (err) {
					throw err;
				}
				if (!rows.length) {
					res.json({
						status: "error",
						data: []
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
						destinations += (foli.street_number.length > 10) ? foli.street_number : (foli.street_number + "," + foli.street_name);
						destinations += "," + foli.district_name + "," + foli.city_name + "|";
					}
				}

				// console.log(origin);
				// console.log(destinations);
				var url = googleMapQuery(StandardString(origin), StandardString(destinations));
				// console.log(url);
				axios.get(url)
				.then(response => {
					var data = response.data.rows[0].elements;
					// console.log(response.data.rows[0].elements);
						if(Number(distanceSelected) < 0){
							for (let i = 0; i < data.length; i++) {
								FOODSEARCH[i].distance = data[i].distance.text;

								console.log(data[i].distance);
							}

							res.json({
								status: "success",
								data: FOODSEARCH
							});
						}
						else {
							for (let i = 0; i < data.length; i++) {

								var dist = data[i].distance.text.split(' ')[0];
								if(Number(dist) < Number(distanceSelected)){
									console.log("on");
									FOODSEARCH[i].distance = data[i].distance.text;
									FOODDISTANCE.push(FOODSEARCH[i]);
								}
							}
							res.json({
								status: "success",
								data: FOODDISTANCE
							});
						}
				})
				// distance.get({
				// 	origin: StandardString(origin),
				// 	destination: StandardString(destinations),
				// 	mode: 'transit',
				// 	units: 'metric'
				// },
				// function(err, data) {
				// 	console.log('line 412');
				// 	if (err) return console.log(err);
				// 	console.log('line 414');
				// 	if(Number(distanceSelected) < 0){
				// 		for (let i = 0; i < data.length; i++) {
				// 			FOODSEARCH[i].distance = data[i].distance;
				//
				// 			console.log(data[i].distance);
				// 		}
				//
				// 		res.json({
				// 			status: "success",
				// 			data: FOODSEARCH
				// 		});
				// 	}
				// 	else {
				// 		for (let i = 0; i < data.length; i++) {
				//
				// 			var dist = data[i].distance.split(' ')[0];
				// 			if(Number(dist) < Number(distanceSelected)){
				// 				console.log("on");
				// 				FOODSEARCH[i].distance = data[i].distance;
				// 				FOODDISTANCE.push(FOODSEARCH[i]);
				// 			}
				// 		}
				// 		res.json({
				// 			status: "success",
				// 			data: FOODDISTANCE
				// 		});
				// 	}
				// })
			})
		}
		else {

			connection.query(searchQuery,(err, rows) => {
				if (err) {
					throw err;
				}
				if(!rows.length){
					// console.log('rows = ' + rows.length);
					res.json({
						status: "error",
						data: []
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
						destinations += (foli.street_number.length > 10) ? foli.street_number : (foli.street_number + "," + foli.street_name);
						destinations += "," + foli.district_name + "," + foli.city_name + "|";
					}
				}

				var url = googleMapQuery(StandardString(origin), StandardString(destinations));
				// console.log(url);
				axios.get(url)
				.then(response => {
					var data = response.data.rows[0].elements;
					// console.log(response.data.rows[0].elements);
						if(Number(distanceSelected) < 0){
							for (let i = 0; i < data.length; i++) {
								FOODSEARCH[i].distance = data[i].distance.text;

								console.log(data[i].distance);
							}

							res.json({
								status: "success",
								data: FOODSEARCH
							});
						}
						else {
							for (let i = 0; i < data.length; i++) {

								var dist = data[i].distance.text.split(' ')[0];
								if(Number(dist) < Number(distanceSelected)){
									console.log("on");
									FOODSEARCH[i].distance = data[i].distance.text;
									FOODDISTANCE.push(FOODSEARCH[i]);
								}
							}
							res.json({
								status: "success",
								data: FOODDISTANCE
							});
						}
				})
			})

		};

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
						// console.log(rows);
						// console.log("i = " + index);
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
		// console.log(CATEGORY[i].cate_id);
		SequenceCategory(0, len, CATEGORY, FOODCATEGORYLIST);
		res.json({
			status: "success",
			data: FOODCATEGORYLIST
		});


	})

	router.get("/food-category/:id", function(req, res){
		var categoryId = req.params.id;
		// console.log(categoryId);
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


	router.get("/food-nearby/:place/:food_id", function(req, res){
		// console.log(req.params);
		var NEARBY = [];
		var maxNearDistance = 3;
		var origin = req.params.place;
		var food_id = req.params.food_id;
		var destinations = "";
		for (var i = 0; i < FOODLIST.length; i++) {
			var foli = FOODLIST[i];
			destinations += (foli.street_number.length > 10) ? foli.street_number : (foli.street_number + "," + foli.street_name);
			destinations += "," + foli.district_name + "," + foli.city_name + "|";
			// destinations += foli.street_number + "," + foli.street_name + "," + foli.district_name + "," + foli.city_name + "|";

		}
		// console.log(origin);
		// console.log(destinations);
		var url = googleMapQuery(StandardString(origin), StandardString(destinations));

		console.log(url);
		axios.get(url)
		.then(response => {
			var data = response.data.rows[0].elements;
			console.log(data);
			for (let i = 0; i < data.length; i++) {
				var distance = data[i].distance.text;
				if(Number(distance.split(" ")[0]) < maxNearDistance){
					var foli = FOODLIST[i];
					foli.distance = distance;
					if(Number(foli.id) !== Number(food_id)){
						// console.log('foodlist.id = ' + foli.id);
						NEARBY.push(foli);
					}

				}
				// console.log(data[i].distance);
			}

			// console.log(FOODSEARCH);

			res.json({
				status: "success",
				data: NEARBY
			});
			// console.log(response.data.rows[0].elements);

		})
	});


	router.get('/like-favorite/:food_id/:user_id', function(req, res){
		// console.log(req.params);
		const {food_id, user_id } = req.params;
		// console.log("user_id = " + user_id);
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

	router.get('/food-like/:userid', function(req, res){
		connection.query('SELECT food_id FROM likes WHERE user_id = ?',req.params.userid,(err, rows) => {
			if(err) throw err;
			var data = [];
			let listId = [];
			for (let i = 0; i < rows.length; i++) {
				listId.push(rows[i].food_id);
			}
			console.log(listId);
			for (let j = 0; j < FOODLIST.length; j++) {
				if (listId.includes(FOODLIST[j].id)) {
					data.push(FOODLIST[j]);
				}
			}

			res.json({
				status: 'success',
				data: data
			})
		})
	})

	router.get('/food-favorite/:userid', function(req, res){
		connection.query('SELECT food_id FROM favorites WHERE user_id = ?',req.params.userid,(err, rows) => {
			if(err) throw err;
			var data = [];
			let listId = [];
			for (let i = 0; i < rows.length; i++) {
				listId.push(rows[i].food_id);
			}
			console.log(listId);
			for (let j = 0; j < FOODLIST.length; j++) {
				if (listId.includes(FOODLIST[j].id)) {
					data.push(FOODLIST[j]);
				}
			}

			res.json({
				status: 'success',
				data: data
			})
		})
	})

	router.get('/food-post/:userid', function(req, res){
		var FOODPOST = [];
		queryPost = queryAll + " WHERE owner_id = ? ";

		connection.query(queryPost, req.params.userid, (err, rows) => {
				if (err) {
					throw err;
				}
				if (!rows.length) {
					res.json({
						status: "error",
						data: []
					});
					return;
				}
				else {
					SequenceQuery(rows, 0, rows.length, FOODPOST, res);
				}
		})
		// connection.query('SELECT id FROM foods WHERE owner_id = ?',req.params.userid,(err, rows) => {
		// 	if(err) throw err;
		// 	var data = [];
		// 	let listId = [];
		// 	for (let i = 0; i < rows.length; i++) {
		// 		listId.push(rows[i].id);
		// 	}
		// 	console.log(listId);
		// 	for (let j = 0; j < FOODLIST.length; j++) {
		// 		if (listId.includes(FOODLIST[j].id)) {
		// 			data.push(FOODLIST[j]);
		// 		}
		// 	}
		//
		// 	res.json({
		// 		status: 'success',
		// 		data: data
		// 	})
		// })
	})



	router.get("/food/:id", function (req, res){
		// console.log(req.params.id);
		// console.log(FOODLIST[3].id === Number(req.params.id));
		// // console.log(FOODLIST[3].id);
		//
		// for (let j = 0; j < FOODLIST.length; j++) {
		// 	if ( Number(req.params.id) === FOODLIST[j].id) {
		// 		// console.log(req.params.id === FOODLIST[j].id);
		// 		res.status(200).json({
		// 			status: "success",
		// 			data: FOODLIST[j]
		// 		})
		// 		res.end();
		// 	}
		// }

		var foodData = [];
		var foodId = req.params.id;
		console.log(req.params.id);
		var query = "SELECT fos.*,cate.cate_name, rest.restaurant_name, usr.username,str.street_name, str.district_name, str.city_name FROM foods AS fos";
		// var query = "SELECT fos.*,cate.cate_name, rest.restaurant_name, detail.detail_name, usr.username,str.street_name, str.district_name, str.city_name FROM foods AS fos";
		query += " INNER JOIN users AS usr ON fos.owner_id = usr.id";
		query += " INNER JOIN restaurants AS rest ON fos.restaurant_id = rest.restaurant_id";
		query += " INNER JOIN category AS cate ON fos.category_id = cate.id";
		// query += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";
		// query += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";
		query += " INNER JOIN streets AS str ON fos.street_id = str.street_id AND fos.district_id = str.district_id AND fos.city_id = str.city_id";

		query +=  " WHERE fos.id = " + foodId;
		// console.log(query);
		var listFileId = [];

		DatabaseQuery(query).then(
			res => {
				// console.log(res);
				foodData = res[0];
				return DatabaseQuery("SELECT img.file_id, img.status FROM images AS img WHERE img.food_id = ?", foodId);
			}
		).then(
			imageRes => {
				// console.log(foodData);
				// let list = [];
				let pending = [];
				let approve = [];
				if(imageRes.length){
					// console.log("leng > 0");
					for (var i = 0; i < imageRes.length; i++) {
						var img = imageRes[i];
						if (img.status === "pending") {
							pending.push(img.file_id);
						} else {
							approve.push(img.file_id);
						}
						listFileId.push(img.file_id)

					}
				}

				// foodData.imageUrl =[];

				foodData.imageUrl = {
					pending : pending,
					approve : approve
				};

				// foodData.imageUrl = list;
				return DatabaseQuery("SELECT vid.file_id, vid.status FROM videos AS vid WHERE vid.food_id = ?", foodId);
			}
		)
		.then(
			videoRes => {
				let list = [];
				let pending = [];
				let approve = [];
				for (var i = 0; i < videoRes.length; i++) {
					var video = videoRes[i];
					if (video.status === "pending") {
						pending.push( video.file_id );
					} else {
						approve.push( video.file_id );
					}
					listFileId.push(video.file_id);
				}
				foodData.videoUrl = {
					pending : pending,
					approve : approve
				}

				foodData.listFileId = listFileId;

				// foodData.videoUrl.push({
				// 	pending : pending,
				// 	approve : approve
				// })


				// foodData.videoUrl = list;

				res.status(200).json({
					status: "success",
					data: foodData
				})
			}
		)
	});

	router.get("/food-list", function(req, res){
		var FOODS = [];
		connection.query(queryAll,(err, rows) => {
			if (err) {
				throw err;
			}
			SequenceQuery( rows, 0, rows.length, FOODS, res);

		});

		// res.status(200).json({
		// 	status: 'success',
		// 	foods : FOODLIST
		// });



	});

	router.get('/food-approve', function(req, res) {
		var FOODAPPROVE = [];
		queryApprove = queryAll + " WHERE fos.status = ? ";

		connection.query(queryApprove, 'approve', (err, rows) => {
				if (err) {
					throw err;
				}
				if (!rows.length) {
					res.json({
						status: "error",
						data: []
					});
					return;
				}
				else {
					SequenceQuery(rows, 0, rows.length, FOODAPPROVE, res);
				}
		})
		// connection.query('SELECT id FROM foods WHERE status = ?', 'approve', (err, rows) => {
		// 	if (err) {
		// 		throw err;
		// 	}
		// 	if (!rows.length) {
		// 		res.json({
		// 			status: "error",
		// 			data: []
		// 		});
		// 		return;
		// 	}
		//
		// 	let listId = [];
		// 	for (let i = 0; i < rows.length; i++) {
		// 		listId.push(rows[i].id);
		// 	}
		// 	for (let j = 0; j < FOODLIST.length; j++) {
		// 		if (listId.includes(FOODLIST[j].id)) {
		// 			// var foli = JSON.stringify(FOODLIST[j]);
		// 			var foli = FOODLIST[j];
		// 			console.log("foli " + j + ': ' + foli.street_name);
		// 			FOODAPPROVE.push(foli);
		// 		}
		// 	}
		//
		// 	res.json({
		// 		status: 'success',
		// 		foods : FOODAPPROVE
		// 	})
		// });
	})

	router.get("/food-pending", function(req, res){
		var FOODPENDING = [];
		queryPending = queryAll + " WHERE fos.status = ? ";

		connection.query(queryPending, 'pending', (err, rows) => {
				if (err) {
					throw err;
				}
				if (!rows.length) {
					res.json({
						status: "error",
						data: []
					});
					return;
				}
				else {
					SequenceQuery(rows, 0, rows.length, FOODPENDING, res);
				}
		})

	});

	router.post("/add-comment", function(req, res){
		// console.log(req.body);
		const {user_id, username, content, food_id, date } = req.body;
		// INSERT INTO likes(user_id, food_id) VALUES(?,?)
		connection.query('insert into comments(user_id, username, content, food_id, date) values(?,?,?,?,?) ',
			[ user_id, username, content, food_id, date ],
			function(err, rows){
				if (err) {
					throw err;
				}
				res.json({
					status :'success'
				})
			}
		)
	});
	router.get('/comments/:food_id', function(req, res) {
		connection.query('select * from comments where food_id  = ?',
			req.params.food_id,
			function(err, rows){
				if (err) {
					throw err;
				}
				res.json({
					status :'success',
					data: rows
				})
			}
		)
	})

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
