
// http://localhost:8080/food/
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = [
 // 'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appfolder',
    'https://www.googleapis.com/auth/drive.install',
    'https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive.photos.readonly',
];

const TOKEN_PATH = 'credentials.json';

// var googleDrive = require('../config/DriveAPI/googleDrive.js')();

module.exports = function(router, connection, upload){

    router.get('/test', upload.array('uploadFile', 10), function(req, res) {
        connection.query('UPDATE videos SET file_id = ? , folder_id = ? WHERE id = ?', ['mot', 'hai', 13], (err, row) => {
            console.log(row);
        })
    });

    router.post('/set-avatar', function (req, res) {
        // console.log(req.body);
        const {food_id, file_id } = req.body;
        connection.query('UPDATE foods SET avatar = ? WHERE id = ?', [file_id, food_id], (err, row) => {
            if (err) {
                res.json({
                    status: 'fail'
                })
                res.end();
            }
            res.json({
                status: 'success'
            })

        })
    })

    router.post('/dislike', function(req, res){
        console.log(req.body);
        const {user_id, food_id} = req.body;
        connection.query("DELETE FROM likes WHERE user_id = ? AND food_id = ?", [user_id, food_id], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json({
                msg : 'remove like'
            })
            console.log("remove like success");
        })
    });

    router.post('/like', function(req, res){
        console.log(req.body);
        const {user_id, food_id} = req.body;
        connection.query("INSERT INTO likes(user_id, food_id) VALUES(?,?)", [user_id, food_id], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json({
                msg : 'add like'
            })
            console.log("add like success");
        })
    });

    router.post('/disfavorite', function(req, res){
        console.log(req.body);
        const {user_id, food_id} = req.body;
        connection.query("DELETE FROM favorites WHERE user_id = ? AND food_id = ?", [user_id, food_id], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json({
                msg : 'remove favorite'
            })
            console.log("remove favorite list success");
        })
    });

    router.post('/favorite', function(req, res){
        console.log(req.body);
        const {user_id, food_id} = req.body;
        connection.query("INSERT INTO favorites(user_id, food_id) VALUES(?,?) ", [user_id, food_id], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json({
                status: 'add favorite'
            })
            console.log("add favorite list success");


        })
    });

    router.post('/delete', function(req, res){
        const { food_id, listFileId } = req.body;

        // console.log(req.body);

        var len = listFileId.length;
        if(len){
            for (var i = 0; i < len; i++) {
                deleteAllInFood(listFileId[i], i, len - 1, food_id, res);
            }
        }
        else {
            var query = "DELETE FROM foods WHERE foods.id = " + food_id;
            connection.query(query, (err, rows) => {
                if(err){
                    res.json({
                        status: 'errors'
                    });
                    return;
                }
                res.json({
                    status: 'success'
                });
            })
        }
    })

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

    router.get('/approve/:id', function(req, res){
        console.log(req.params);

        var food_id = req.params.id;
        DatabaseQuery("UPDATE images SET status = ? WHERE food_id = ?",['approve', food_id])
        .then(
            row => {
                DatabaseQuery("UPDATE videos SET status = ? WHERE food_id = ?",['approve', food_id])
            }
        )
        .then(
            row => {
                return DatabaseQuery("UPDATE foods SET status = ? WHERE id = ?",['approve', food_id])
            }
        )
        .then(
            row => {
                res.json({
                    status: "success",
                    msg: "Bài viết đã được duyệt"
                })
            }
        ).catch(
            err => {
                res.json({
                    status: 'errors'
                })
            }
        )
    })

    router.post('/image/approve/:food_id/:file_id', function(req, res){
        console.log(req.params);
        const {food_id, file_id } = req.params;
        connection.query("UPDATE images SET status = ? WHERE food_id = ? and file_id = ?",['approve', food_id, file_id], (err, rows) => {
            if(err){
                throw err;
            }
            // console.log(rows);
            res.json({
                status: "success",
                msg: "Ảnh đã được duyệt"
            })
        })
    })

    router.get('delete/:file_id', function(req, res){
        const { file_id } = req.params;
        deleteFileOnDrive(file_id);
    });

    router.post('/image/disapprove/:food_id/:file_id', function(req, res){
        console.log(req.params);
        const {food_id, file_id } = req.params;
        deleteImageOnDrive(food_id, file_id, res);
    })

    router.post('/video/approve/:food_id/:file_id', function(req, res){
        console.log(req.params);
        const {food_id, file_id } = req.params;
        connection.query("UPDATE videos SET status = ? WHERE food_id = ? and file_id = ?",['approve', food_id, file_id], (err, rows) => {
            if(err){
                throw err;
            }
            // console.log(rows);
            res.json({
                status: "success",
                msg: "Ảnh đã được duyệt"
            })
        })
    })

    router.post('/video/disapprove/:food_id/:file_id', function(req, res){
        console.log(req.params);
        const {food_id, file_id } = req.params;
        deleteVideoOnDrive(food_id, file_id, res);
    })

    router.post('/add-media-file', upload.array('uploadFile', 50), function(req, response){
        console.log(req.body);
        console.log(req.files);
        const { food_id, owner_id }  = req.body;
        var fileList = req.files;
        if(!fileList.length){
            response.json({
                status : "success",
                msg : "none media files is added"
            });
            response.end();
        }

        for(var i=0; i < fileList.length; i++ ){
            var fst = fileList[i];
            if(fst.mimetype.includes("image")){
                uploadImage(fst.filename, fst.path, fst.mimetype, food_id, owner_id);
            }
            else{
                uploadVideo(fst.filename, fst.path, fst.mimetype, food_id, owner_id);
            }
        }

        response.json({
            status : "success",
            msg : "add media files"
        })
    });

    router.post('/edit/:id', upload.array('uploadFile', 50), function(req, response){
        console.log(req.body);
        console.log(req.files);
        var foodId = req.params.id;
        var { name, description, min_price, max_price, city, district, street, category, detail, owner_id, restaurant_name, restaurant_id, street_number } = req.body;
        var addressId;
        var fileList = req.files;

        function UpdateRestaurantInfo() {
            return new Promise( ( resolve, reject ) => {
                connection.query('select id from streets where city_id =  ? and district_id = ? and street_id = ?',
                    [city, district, street],
                    function(err, rows){
                        if (err) {
                            console.log('err');
                            // throw err;
                        }
                        resolve(rows);
                    }
                )
            });
        }

        // .then(
        //     res => {
        //         addressId = res[0].id;
        //         return new Promise( ( resolve, reject ) => {
        //             connection.query('SELECT restaurant_id FROM restaurants  WHERE restaurant_name = ? and address_id = ? and street_number = ?', [restaurant_name, addressId, street_number], ( err, rows ) => {
        //                 if ( err )
        //                     return reject( err );
        //                 resolve( rows );
        //             })
        //         });
        //     }
        // )
        // .then(res =>{
        //     console.log(res);
        //
        //     if(!res.length){
        //
        //         return new Promise( ( resolve, reject ) => {
        //             connection.query('INSERT INTO restaurants (restaurant_name, street_number,  address_id) VALUES (?,?,?)',[restaurant_name, street_number, addressId], ( err, rows ) => {
        //                 if ( err )
        //                     return reject( err );
        //                 resolve( rows.insertId );
        //             })
        //         });
        //     }
        //     else {
        //         return res[0].restaurant_id;
        //     }
        // })


        UpdateRestaurantInfo()
        .then(
            res => {
                // console.log(restaurant_id);
                addressId = res[0].id;
                return DatabaseQuery('SELECT restaurant_id FROM restaurants WHERE restaurant_name = ? AND address_id = ? AND street_number = ?', [restaurant_name, addressId, street_number])
            }
        )
        .then(
            res => {
                if(res.length){
                    return new Promise( ( resolve, reject ) => {
                        restaurant_id = res[0].restaurant_id;
                        resolve(restaurant_id);
                    });

                }
                else{
                    return DatabaseQuery('UPDATE restaurants SET restaurant_name = ?, street_number = ?, address_id = ? WHERE restaurant_id = ? ', [ restaurant_name, street_number, addressId, restaurant_id ]);
                }
            }
        )
        .then(res => {

            var updateData = [ name, description, min_price, max_price, city, district, street, street_number, category, detail, restaurant_id, foodId ];

            updateFood(updateData, fileList);

            function updateFood(data, fileList){
                connection.query(
                    'UPDATE foods SET name = ?, description = ?, min_price = ?, max_price = ?, city_id = ?, district_id = ?, street_id = ?, street_number = ?, category_id = ?, detail_category_id = ?, restaurant_id = ? WHERE id = ? ',
                    data,
                    function(err, result, fields){
                        if (err) {
                            response.json({
                                status : "errors",
                                msg : "update errors"
                            });
                            response.end();
                        }

                        if(!fileList.length){
                            response.json({
                                status : "success",
                                msg : "info update and no files upload"
                            });
                            response.end();
                        }
                        else {
                            for(var i=0; i < fileList.length; i++ ){
                                var fst = fileList[i];
                                if(fst.mimetype.includes("image")){
                                    uploadImage(fst.filename, fst.path, fst.mimetype, foodId, owner_id);
                                }
                                else{
                                    uploadVideo(fst.filename, fst.path, fst.mimetype, foodId, owner_id);
                                }
                            }

                            response.json({
                                status : "success",
                                msg : "info and files update"
                            })
                        }


                    }
                )

            }
        })
    });


    router.post('/create', upload.array('uploadFile', 50), function(req, response) {
        // var file = req.files;
        console.log(req.body);
        console.log(req.files);
        const { name, description, min_price, max_price, city, district, street, street_number, category, detail, owner_id, restaurant_name } = req.body;

        var addressId, restaurant_id, insertData = [];
        var fileList = req.files;

        function UpdateRestaurantInfo() {
            return new Promise( ( resolve, reject ) => {
                connection.query('select id from streets where city_id =  ? and district_id = ? and street_id = ?',
                    [city, district, street],
                    function(err, rows){
                        if (err) {
                            throw err;
                        }
                        resolve(rows);
                    }
                )
            });
        }


        UpdateRestaurantInfo()
        .then(
            res => {
                addressId = res[0].id;
                return new Promise( ( resolve, reject ) => {
                    connection.query('SELECT restaurant_id FROM restaurants  WHERE restaurant_name = ? AND address_id = ? AND street_number = ?', [restaurant_name, addressId, street_number], ( err, rows ) => {
                        if ( err )
                            return reject( err );
                        resolve( rows );
                    })
                });
            }
        ).then(res =>{
            console.log(res);

            if(!res.length){
                return new Promise( ( resolve, reject ) => {
                    connection.query('INSERT INTO restaurants (restaurant_name, street_number, address_id) VALUES (?,?,?)',[restaurant_name, street_number, addressId], ( err, rows ) => {
                        if ( err )
                            return reject( err );
                        resolve( rows.insertId );
                    })
                });
            }
            else {
                return res[0].restaurant_id;
            }
        }).then(res => {
            // console.log("next then res = " + res);
            restaurant_id = res;

            console.log(insertData);
            insertData = [ name, description, min_price, max_price,  city, district, street, street_number, category, detail, owner_id, restaurant_id, 'pending'];

            insertFood(insertData, fileList);

            function insertFood(data, fileList){
                connection.query(
                    'INSERT INTO foods (name, description, min_price, max_price, city_id, district_id, street_id, street_number, category_id, detail_category_id, owner_id, restaurant_id, status ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    data,
                    function(err, result, fields){
                        if (err) {
                            throw err;
                        }
                        // console.log("add food");
                        // console.log(result);
                        var foodId = result.insertId;
                        for(var i=0; i < fileList.length; i++ ){
                            var fst = fileList[i];
                            var fileId = "";
                            if(fst.mimetype.includes("image")){
                                uploadImage(fst.filename, fst.path, fst.mimetype, foodId, owner_id);
                            }
                            else{
                                uploadVideo(fst.filename, fst.path, fst.mimetype, foodId, owner_id);
                            }
                        }

                        response.json({
                            status: 'success'
                        })

                    }
                )

            }
        })
    });



    function uploadVideo(fileName, filePath, mimeType, foodid, owner_id) {
        fs.readFile("routes/client_secret.json", (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // console.log(content);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), addVideo, fileName, filePath, mimeType, foodid, owner_id);
        });

        // authorize(JSON.parse(file), addVideo, fileName, filePath, mimeType, foodid);
    }

    function uploadImage (fileName, filePath, mimeType, foodid, owner_id) {
        // console.log(process.cwd());
        // console.log(__dirname);
        fs.readFile("routes/client_secret.json", (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // console.log(JSON.parse(content));
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), addImage, fileName, filePath, mimeType, foodid, owner_id);
        });
        // authorize(JSON.parse(file), addVideo, fileName, filePath, mimeType, foodid);
    }

    function deleteImageOnDrive(food_id, file_id, res) {
        fs.readFile("routes/client_secret.json", (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            console.log(content);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), deleteImage, food_id, file_id, res);
        });

        // authorize(JSON.parse(file), addVideo, fileName, filePath, mimeType, foodid);
    }

    function deleteImage(auth, food_id, file_id, response){
        // console.log('food_id ' + food_id);
        // console.log('file_id ' + file_id);
        const drive = google.drive({ version: 'v3', auth });
        drive.files.delete({
                'fileId': file_id
            }, function(err){
                if(err){
                    console.log('errors');
                    // console.log(err);
                    response.json({
                        status : 'fail',
                        msg: 'Xóa ảnh không thành công'
                    });
                }
                else {
                    connection.query("DELETE from images WHERE food_id = ? and file_id = ?",[food_id, file_id], (err, rows) => {
                        if(err){
                            response.json({
                                status : 'fail',
                                msg: 'Xóa ảnh không thành công'
                            });
                            return;
                        }
                        console.log(rows);
                        console.log('delete success');
                        response.json({
                            status: "success",
                            msg: "Xóa ảnh thành công"
                        })
                    })

                }
            }
        );
    }

    function deleteVideoOnDrive(food_id, file_id, res) {
        fs.readFile("routes/client_secret.json", (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // console.log(content);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), deleteVideo, food_id, file_id, res);
        });

        // authorize(JSON.parse(file), addVideo, fileName, filePath, mimeType, foodid);
    }

    function deleteVideo(auth, food_id, file_id, response){
        const drive = google.drive({ version: 'v3', auth });
        drive.files.delete({
                'fileId': file_id
            }, function(err){
                if(err){
                    console.log('errors');
                    console.log(err);
                    response.json({
                        status: 'fail',
                        msg: 'Xóa video không thành công'
                    });
                }
                else {
                    connection.query("DELETE from videos WHERE food_id = ? and file_id = ?",[food_id, file_id], (err, rows) => {
                        if(err){
                            response.json({
                                status : 'fail',
                                msg: 'Xóa video không thành công'
                            });
                            return;
                        }
                        // console.log(rows);
                        console.log('delete success');
                        response.json({
                            status: "success",
                            msg: "Xóa video thành công"
                        })
                    })
                }
            }
        )

    }

    function deleteAllInFood(file_id, index, len, food_id, response) {
        fs.readFile("routes/client_secret.json", (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // console.log(content);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), deleteAll, file_id, index, len, food_id, response);
        });

        // authorize(JSON.parse(file), addVideo, fileName, filePath, mimeType, foodid);
    }

    function deleteAll(auth, file_id, index, len, food_id, response){
        const drive = google.drive({ version: 'v3', auth });
        drive.files.delete({
                'fileId': file_id
            }, function(err){
                if(err){
                    // console.log('errors');
                    // console.log(err);
                    response.json({
                        status: 'errors',
                        error: err
                    });
                }
                else {
                    if(index === len){
                        var query = "DELETE FROM foods WHERE foods.id = " + food_id;
                        connection.query(query, (err, rows) => {
                            if(err){
                                throw err;
                            }
                            console.log("delete all success");
                            response.json({
                                status: 'success'
                            });
                        })
                    }
                }
            }
        )

    }


    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback, param_1, param_2,  param_3, param_4, param_5) {
        // console.log("??????????????????????????" + Buffer.from(param_2));
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        // const { client_secret, client_id, redirect_uris } = credentials.web;
        const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client, param_1, param_2, param_3, param_4, param_5);
        });
    }

/*    *
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.

*/    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return callback(err);
                oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    function addImage(auth, fileName, filePath,  mimeType, foodid, owner_id) {

        console.log(mimeType);
        const drive = google.drive({ version: 'v3', auth });
        var folderId = '1yjCE1BKj_FTORsYHywptNG2c8fI-IVVm';
        var fileMetadata = {
            'name': fileName,
            parents: [folderId]
        };

        var media = {
            mimeType:  mimeType,
            body: fs.createReadStream(filePath)
        };

        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, function(err, file) {
            if (err) {
        // Handle error
                console.error(err);
            } else {
                // console.log(file);
                // console.log('File Id: ',file.data.id);
                let fileid = file.data.id;
                console.log("image id : " + fileid);
                connection.query('INSERT INTO images (file_id, food_id, owner_id, status) VALUES (?,?,?,?)',
                    [fileid, foodid, owner_id, 'pending'],
                    function(err, res, fields){
                        if (err) {
                            throw err;
                            return;
                        }
                        console.log("add image success");
                    }
                )
            }
        });
    }

    function addVideo(auth, fileName, filePath,  mimeType, foodid, owner_id) {


        // console.log("++++++++++++++++" + fileName);
        console.log(mimeType);
        const drive = google.drive({ version: 'v3', auth });
        var folderId = '1dZ8VH9800FkNGhNbMaqhaLYUggr4tcFF';
        var fileMetadata = {
            'name': fileName,
            parents: [folderId]
        };

        var media = {
            mimeType:  mimeType,
            body: fs.createReadStream(filePath)
        };

        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        },function(err, file) {


            if (err) {
                // Handle error
                console.error(err);
            } else {
                // console.log(file);
                console.log('File Id: ', file.data.id);
                let fileid = file.data.id;
                connection.query('INSERT INTO videos (file_id, food_id, owner_id, status) VALUES (?,?,?,?)',
                    [fileid, foodid, owner_id, 'pending'],
                    function(err, res, fields){
                        if (err) {
                            throw err;
                            return;
                        }
                        console.log("add video success");
                    }
                )
            }
        })
    };




	// router.post('/', function (req, res, next) {

 //    console.log("=====================================");
 //    // console.log(req.files.file);
 //    console.log(req.body);

 //    let imageFile = req.files.file;
 //    // console.log(req);
 //      // imageFile.mimetype = "image/png"
 //    var imgExtension = imageFile.mimetype.split("/")[1];
 //    var fileName = req.body.filename+ '.' + imgExtension;
 //    console.log(fileName);

 //    uploadService.single('imgfe')(req, res, function(err){
 //          console.log(req.files.file);
 //      if (err) {
 //        throw err;
 //      }
 //      console.log("upload success");
 //    });

 //      //     res.json({
 //      //   file: `/upload/${fileName}`
 //      // });


 //    // imageFile.mv(`/upload/${fileName}`, function(err) {
 //    //   if (err) {
 //    //     return res.status(500).send(err);
 //    //   };

 //    res.send();


 //    // });

 //  });

}
