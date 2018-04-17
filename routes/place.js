module.exports = function(router, connection, CITY, DISTRICT, STREET, CITYLIST, DISTRICTLIST, STREETLIST){

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
			console.log('city ok.');
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

			console.log("district ok");
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

								}

							);

						}

					}
				);
				
			}

			console.log('street ok.');
		}
	)


	router.get('/cities', function (req, res) {
		res.status(200).json({
			status: 'success',
			cities: CITY
		})
	});


	router.get("/citylist", function(req, res){
		res.status(200).json({
			status: 'success',
			cityList : CITYLIST,

		})
	});

	router.get('/districts', function (req, res){
		res.status(200).json({
			status: 'success',
			districts: DISTRICT
		})
	});	


	router.get('/districtlist', function (req, res){
		res.status(200).json({
			status: 'success',
			districtList: DISTRICTLIST
		})
	});	

	router.get('/streets', function (req, res){
		res.status(200).json({
			status: 'success',
			streets: STREET
		})
	});

	router.get('/streetlist', function (req, res){
		res.status(200).json({
			status: 'success',
			streetList: STREETLIST
		})
	});

};