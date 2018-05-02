//localhost:8000/auth
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});

var bcrypt = require('bcrypt-nodejs');

module.exports = function(router, connection, upload){

    // let users = [
    //     {
    //         id: 1,
    //         username: 'test',
    //         password: 'asdf123'
    //     },
    //     {
    //         id: 2,
    //         username: 'test2',
    //         password: 'asdf12345'
    //     }
    // ];


	router.get('/', jwtMW, (req, res) => {
	    res.send('You are authenticated'); //Sending some response when authenticated
	});

    router.post('/edit-user', (req, res) => {
        console.log(req.body);
        const { userId, firstname, lastname, email, oldPassword, newPassword, confirmPassword, provider, username, type} = req.body;

        var data = {
            id : userId,
            first_name : firstname,
            last_name : lastname,
            email : email,
            provider : provider,
            type : type
        };
        if(username){
            data.username = username;
        }
        connection.query("SELECT * FROM users WHERE id = ?",userId, function(err, rows, fields){

            if (err) {
                console.log("err"+  err);
                res.send(JSON.stringify({
                    success: false,
                    token: null,
                    msg: 'Cập nhật không thành công, vui lòng thực hiện lại'
                }));
                return;
            }

            if(oldPassword){
                if(!bcrypt.compareSync(oldPassword, rows[0].password)){
                    res.json({
                        success: false,
                        token: null,
                        token: null,
                        msg: 'Mật khẩu cũ không đúng'
                    });
                    return;
                }

                var bcryptPassword = bcrypt.hashSync(newPassword);

                connection.query('UPDATE users SET password = ?, first_name = ?, last_name = ?, email = ? WHERE id = ? ',
                    [ bcryptPassword, firstname, lastname, email, userId],
                    function (err, row) {
                        if (err) {
                            throw err;
                        }

                        let token = jwt.sign({ username : rows[0].username , password: newPassword }, 'keyboard cat 4 ever', { expiresIn: 3600 });
                        console.log(token);
                        res.json({
                            success: true,
                            err: null,
                            token,
                            user : data
                        })
                    }
                );

            }
            else {
                connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ? ',
                    [ firstname, lastname, email, userId],
                    (err, row) => {
                        if (err) {
                            throw err;
                        }

                        let token = jwt.sign({ username : email , password: userId }, 'keyboard cat 4 ever', { expiresIn: 3600 });

                        res.json({
                            success: true,
                            err: null,
                            token,
                            user : data
                        })

                    }
                );
            }

            // let token = jwt.sign({ username : data.username , password: data.newPassword }, 'keyboard cat 4 ever', { expiresIn: 3600 });
            //
            // res.status(200).json({
            //     success: true,
            //     err: null,
            //     token,
            //     user : rows[0]
            // });


        });
    })

    router.post('/login-google-facebook', (req, res) => {
        // console.log(req.body);
        // console.log(req.body);
        const {email, firstName, lastName, provider, token } = req.body;
        // console.log(email);
        // console.log(firstName);
        // console.log(lastName);
        // console.log(provider);
        // console.log(token);
        var data = req.body;
        // var bcryptPassword = bcrypt.hashSync(password);

        connection.query("SELECT * FROM users WHERE email = ?",email, function(err, rows) {
            if (err){
                console.log("err"+  err);
                throw err;
            }
            // console.log('line 42');
            console.log(rows);
            if (rows.length) {
                let token = jwt.sign({ username : data.email , password: data.token }, 'keyboard cat 4 ever', { expiresIn: 3600 });
                // console.log(rows.id + '----' + rows[0].id);
                data.id = rows[0].id
                // console.log('line 46'  + token);

                res.status(200).json({
                    success: true,
                    err: null,
                    token,
                    user : data
                });
            } else {
                connection.query(
                    "INSERT INTO users (provider, first_name, last_name, email, token, type) VALUES (?,?,?,?,?,?)",
                    [ provider, firstName, lastName, email, token, 'normal' ],
                    function(err, rows){
                        if(err) {
                            res.status(401).json({
                                success: false,
                                token: null,
                                msg: 'Đăng ký không thành công, vui lòng thực hiện lại'
                            });
                        }
                        // console.log('line 67');
                        // console.log(rows);

                        data["id"] = rows.insertId;

                        let token = jwt.sign({ username : data.email , password: data.token }, 'keyboard cat 4 ever', { expiresIn: 3600 });

                        // console.log('line 71' + token);

                        res.status(200).json({
                            success: true,
                            err: null,
                            token,
                            user : data
                        });
                    }
                );


            }
        })
    });

    router.post('/local-login', (req, res) => {
        const { username, password } = req.body;
        var data = req.body;
        connection.query("SELECT * FROM users WHERE username = ?",username, function(err, rows, fields){

            if (err) {
                console.log("err"+  err);
                res.send(JSON.stringify({
                    success: false,
                    token: null,
                    msg: 'Đăng nhập không thành công, vui lòng thực hiện lại'
                }));
                return;
            }
            if (!rows.length) {
                res.json({
                    success: false,
                    token: null,
                    msg: 'Tên đăng nhập không tồn tại'
                });
                return;
            }

            if(!bcrypt.compareSync(password, rows[0].password)){
                res.json({
                    success: false,
                    token: null,
                    msg: 'Mật khẩu không đúng xin mời nhập lại'
                });
                return;
            }

            let token = jwt.sign({ username : data.username , password: data.password }, 'keyboard cat 4 ever', { expiresIn: 3600 });

            res.status(200).json({
                success: true,
                err: null,
                token,
                user : rows[0]
            });



        });
    });

    router.post('/local-signup', (req, res) => {
        const { username, password,  provider, email, firstname, lastname } = req.body;

        console.log(req.body);
        console.log("local-signup");
        console.log(bcrypt.hashSync(password, null, null));
        var data = req.body;
        var bcryptPassword = bcrypt.hashSync(password);

        connection.query("SELECT * FROM users WHERE username = ? OR email = ? ",[username, email], function(err, rows) {
			if (err){
                console.log("err"+  err);
                throw err;
            }

            // console.log(rows);
            let message = "Tên đăng nhập và email đều đã tồn tại";
            if (rows.length) {
                if(rows.length < 2){
                    if(rows[0].username){
                        message = "Tên đăng nhập đã tồn tại"
                    }
                    else {
                        message = "Email đã tồn tại"
                    }
                }

                res.json({
                    success: false,
                    token: null,
                    msg: message
                })
            } else {

                connection.query(
                    "INSERT INTO users ( username, password, provider, first_name, last_name, email, type ) values (?,?,?,?,?,?,?)",
                    [username,  bcryptPassword, provider, firstname, lastname, email, 'normal'],
                    function(err, rows){
                        if(err) {
                            res.status(401).json({
                                success: false,
                                token: null,
                                msg: 'Đăng ký không thành công, vui lòng thực hiện lại'
                            });
                        }

                        data["id"] = rows.insertId;

                        let token = jwt.sign({ username : data.username , password: data.password }, 'keyboard cat 4 ever', { expiresIn: 3600 });

                        console.log(token);

                        res.status(200).json({
                            success: true,
                            err: null,
                            token,
                            user : data
                        });
                    }
                );


            }
		})

    });

    router.post('/localll', function(req, res){
        console.log(req.body);
        var data = req.body;
        var insertData = [];
        for (let [key, value] of Object.entries(data)) {
           insertData.push(value);
        }
        console.log(insertData);
        console.log("loooooooo");
        connection.query(
            "INSERT INTO users ( username, password, provider, first_name, last_name, email ) values (?,?,?,?,?,?)",
            insertData,
            function(err, rows){
                if(err) throw err;

                let token = jwt.sign({ username : data.username , password: data.password }, 'keyboard cat 4 ever', { expiresIn: 600 });
                res.json({
                    sucess: true,
                    err: null,
                    token
                });
            }
        );

    });

	router.post('/signup', function(req, res){
			// var data = JSON.parse(req.body);
		console.log(req.body);
        console.log("disssss");

		var data = req.body;
		for(var key in data) {
		    break;
		}
		data = JSON.parse( key );
		// data = data.userData;
		console.log(data);
		// console.log(data.firstName);
		var insert = [];
		for (let [key, value] of Object.entries(data)) {
		   insert.push(value);
		}


		// console.log(insert);

		connection.query(
			"SELECT * FROM users WHERE email = ?",
			data.email,
			function(err, row){
				if(err) {
					throw err;
					res.status(401).json({
		                sucess: false,
		                token: null,
		                err: 'Something went wrong'
		            });
				}
				if(row.length){
					let token = jwt.sign({ id: data.token, username: data.email }, 'keyboard cat 4 ever', { expiresIn: 600 }); // Sigining the token
					console.log("token = " + token);
					res.json({
						sucess: true,
						err: null,
						token
					});
					return;
				}
				else {

					connection.query(
						"INSERT INTO users ( first_name, last_name, email, token, imageUrl, provider ) values (?,?,?,?,?,?)",
						insert,
						function(err, rows){
							if(err) throw err;

							let token = jwt.sign({ id: data.token, username: data.email }, 'keyboard cat 4 ever', { expiresIn: 129600 });
							res.json({
								sucess: true,
								err: null,
								token
							});
							return;
						}
					);

				}

			}
		);
	});

	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
};
