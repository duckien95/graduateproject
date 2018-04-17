

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

			var cateLits = [];
			for (var i = 0; i < cates.length; i++) {
				cateLits.push({
					cate_id : cates[i].id,
					cate_name: cates[i].name
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
	var queryAll = "SELECT fos.*,cate.cate_name, rest.restaurant_name, detail.detail_name, usr.username FROM foods AS fos";
	queryAll += " INNER JOIN users AS usr ON fos.owner_id = usr.id";
	queryAll += " INNER JOIN restaurants AS rest ON fos.restaurant_id = rest.restaurant_id";
	queryAll += " INNER JOIN category AS cate ON fos.category_id = cate.id"
	queryAll += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";

	connection.query(queryAll,(err, rows) => {
		if (err) {
			throw err;
		}
		var i = 0;

		console.log(i < rows.length);

		console.log(rows.length);
			SequenceQuery("SELECT img.file_id FROM images AS img WHERE img.food_id = ?", rows, i, rows.length)
			console.log("i = " + i);
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

	function SequenceQuery(query, rows, index, len){

		if(index < len){

		console.log("index = " + index);

		return new Promise( (resolve, reject) => {
			DatabaseQuery("SELECT img.file_id FROM images AS img WHERE img.food_id = ?", rows[index].id)
			.then( imageRes => {
				// console.log("compare imageRes vs undefined " + imageRes !== undefined);
				// if(index === 14){
				// 	console.log("index = 14, length" + imageRes.length);
				// }
				if(imageRes !== undefined){
					let list = [];
					if(imageRes.length){
						// console.log("leng > 0");
						for (var i = 0; i < imageRes.length; i++) {
							for (let [key, value] of Object.entries(imageRes[i])) {
							   list.push(value);

							   // if(index === 14){
								//    console.log("index = 14" + value);
								//    console.log(rows[14]);
							   // }
							   // list[i] = value;
							}
						}
					}


					var row = rows[index];
					let cityid = row.city_id;
					let districtid = row.district_id;
					let streetid = row.street_id;
					// console.log("streetid = " +  JSON.stringify(STREET[1].district_list[1].street_list));
					// console.log("streetid = " +  STREET[1].district_list[1].street_list[2].street_name);

					row.cityname = CITY[cityid].city_name;
					row.districtname = DISTRICT[cityid].district_list[districtid].district_name;
					// row.streetname =  DISTRICT[cityid].district_list[districtid];
					// STREET[res[0].city_id].district_list[res[0].district_id].street_list[res[0].street_id].street_name;
					rows[index].imageUrl = list;
					FOODLIST.push(row);
					// console.log(FOODLIST[14]);
					resolve(true);
				}
				else {
					reject("fail")
				}
			});
		}).then(
			res => {
				SequenceQuery(query, rows, index + 1, len)
			}
		)
	}

	}

	router.get("/food/list", function(req, res){
		res.status(200).json({
			status: 'success',
			foods: FOODLIST
		});
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





	router.get("/food/:id", function (req, res){

		var foodData;
		var foodId = req.params.id;
		// query += " INNER JOIN restaurants AS rest ON foo.restaurant_id = rest.restaurant_id";
		var query = "SELECT fos.*,cate.cate_name, rest.restaurant_name, detail.detail_name, usr.username FROM foods AS fos";
		query += " INNER JOIN users AS usr ON fos.owner_id = usr.id";
		query += " INNER JOIN restaurants AS rest ON fos.restaurant_id = rest.restaurant_id";
		query += " INNER JOIN category AS cate ON fos.category_id = cate.id"
		query += " INNER JOIN detail_category AS detail ON fos.detail_category_id = detail.id";
		// query += " INNER JOIN images AS img ON fos.id = img.food_id";

		query +=  " WHERE fos.id = " + foodId

		var query =

		DatabaseQuery(query,).then(
			res => {
				foodData = res[0];
				// console.log("street_id " + res[0].street_id);
				foodData['cityname'] = CITY[res[0].city_id].city_name;
				foodData['districtname'] = STREET[res[0].city_id].district_list[res[0].district_id].district_name;
				foodData['streetname'] =  STREET[res[0].city_id].district_list[res[0].district_id].street_list[res[0].street_id].street_name;
				// console.log("streetname " +  STREET[res[0].city_id].district_list[res[0].district_id].street_list[res[0].street_id].street_name);
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
				// res.status(200).json({
				// 	status: "success",
				// 	data: foodData
				// })

				return DatabaseQuery("SELECT vid.file_id FROM videos AS vid WHERE vid.food_id = ?", foodId);
				console.log(foodData);


			}
		).then(
			videoRes => {
				console.log(videoRes);
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
		// DatabaseQuery("SELECT img.file_id FROM images AS img WHERE img.food_id = ?", foodId).then(
		// 	res => {
		// 		console.log(res);
		// 	}
		// )


		// connection.query(query, function(err, rows, fileds){
		// 	if(err) throw err;
		// 	console.log(rows);
		// 	let row = rows[0];
		// 	row['cityname'] = CITY[row.city_id].city_name;
		// 	console.log(DISTRICT[row.city_id][row.district_id]);
		// 	row['districtname'] = STREET[row.city_id].district_list[row.district_id].district_name;
		// 	row['stretname'] =  STREET[row.city_id].district_list[row.district_id].street_list[row.street_id].street_name;
		// 	let food = {};
		//
		// 	Object.keys(row).forEach(function(key) {
		// 		food[key] = row[key];
		// 	})
		// 	console.log(food);
		// 	FOOD =  food;
		// 	res.status(200).json({
		// 		status: "success",
		// 		data: row
		// 	})
		// })


		// res.status(200).json({
		// 	status: "success",
		// 	data:
		// })
	})



}
