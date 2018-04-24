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

    router.get('/', function(req, res){

        // var restaurant_name = "nam";
        // var restaurant_id = 1;
        // uploadImage("ronalkean", "upload/photo.jpg", "image/jpg", 1);
        //
        // function getJSON() {
        //     return new Promise( function(resolve) {
        //         uploadImage("ronalkean", "upload/photo.jpg", "image/jpg")
        //         .then( function(json) {
        //             resolve(json);
        //         });
        //     })
        // }




        var restaurant_name = "jellyyyy";
        var restaurant_id;
        function getFileId() {
            return new Promise( ( resolve, reject ) => {
                uploadImage("ronalkean", "upload/photo.jpg", "image/jpg", 15)
                .then(res => {
                    resolve(res)
                })
                // .catch(err => {
                //     reject( err );
                // })
                //     if ( err )
                //         return reject( err );
                //     resolve( rows );
                // })
            });
        }

        // uploadImage("ronalkean", "upload/photo.jpg", "image/jpg", 15).then(res => {
        //     console.log("res = " + res);
        // })

        function getRestaurantId() {
            return new Promise( ( resolve, reject ) => {
                connection.query('SELECT * FROM restaurants WHERE restaurant_name = ?',restaurant_name, ( err, rows ) => {
                    if ( err )
                        return reject( err );
                    resolve( rows );
                })
            });
        }

        getRestaurantId().then(res =>{
            console.log(res);
            if(!res.length){


                connection.query('INSERT INTO restaurants (restaurant_name) VALUES (?)',
                   [restaurant_name],
                   function(err, result, fields){
                       // console.log(result);
                       console.log("insertId = " + result.insertId);
                       restaurant_id = result.insertId;
                       // insertData.push(result.insertId);
                       // insertFood(insertData, fileList); } )
                   })
            }
            else {
                                console.log("res = " + JSON.stringify(res));
                restaurant_id = res[0].restaurant_id;
            }

            return restaurant_id;

            console.log("resid = " + restaurant_id);
        })
        .then(res => {
            console.log("next then res = " + res);
        })

        console.log("finish all resid = " + restaurant_id);
    });

    router.post('/search', function(req, res, next) {
        console.log(req.body);
    });

    router.post('/', upload.array('uploadFile', 10), function(req, res) {
        // var file = req.files;
        console.log(req.body);
        console.log(req.files);

        var restaurant_name = req.body.restaurant;
        var restaurant_id;
        var formData = req.body;
        var fileList = req.files;
        var insertData = [];
        Object.keys(formData).forEach(function(key) {
            insertData.push(formData[key]);
        });
        insertData.splice(-1,1)
        console.log(insertData);
        console.log("restaurant_name :" + restaurant_name);

        function getRestaurantId() {
            return new Promise( ( resolve, reject ) => {
                connection.query('SELECT * FROM restaurants WHERE restaurant_name = ?',restaurant_name, ( err, rows ) => {
                    if ( err )
                        return reject( err );
                    resolve( rows );
                })
            });
        }

        getRestaurantId().then(res =>{
            console.log(res);

            if(!res.length){

                return new Promise( ( resolve, reject ) => {
                    connection.query('INSERT INTO restaurants (restaurant_name) VALUES (?)',restaurant_name, ( err, rows ) => {
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
            console.log("next then res = " + res);
            insertData.push(res);
            insertData.push("pending");
            console.log(insertData);

            insertFood(insertData, fileList);

            function insertFood(data, fileList){
                connection.query(
                    'INSERT INTO foods (name, description, prices, city_id, district_id, street_id, street_number, category_id, detail_category_id, owner_id, restaurant_id, status ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
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
                                uploadImage(fst.filename, fst.path, fst.mimetype, foodId);
                            }
                            else{
                                uploadVideo(fst.filename, fst.path, fst.mimetype, foodId);
                            }
                        }

                    }
                )

            }
        })


        // console.log("after connect mysql" +  restaurant_id);
  // res.end()
});

  router.post('/image', upload.array('uploadFile', 10), function(req, res) {
    console.log("fuck");

    console.log(req.body);
    console.log(req.files);
    console.log(req.files.length);
    var listFile = req.files;
    for (var i=0; i<listFile.length; i++) {
      console.log();
      var lst = listFile[i];
      // googleDrive.uploadToDrive(lst.filename, lst.path, lst.mimetype);
    }
    // console.log(req.file);
    // googleDrive.uploadToDrive("name", req.file.path, req.file.mimetype);
    });

    var file = {"web":{"client_id":"52426440954-08pn0p97pvmfiankiq6j3v646hrh077s.apps.googleusercontent.com","project_id":"viet-food-198010","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"FERWz_fUL5MNoxMyYcUuU2Ra","redirect_uris":["http://localhost:3000/auth/google/callback"],"javascript_origins":["http://localhost:3000"]}}


    // Load client secrets from a local file.

    function uploadVideo(fileName, filePath, mimeType, foodid) {
        fs.readFile(file, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), addVideo, fileName, filePath, mimeType, foodid);
        });
    }

    function uploadImage (fileName, filePath, mimeType, foodid) {
        fs.readFile(file, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), addImage, fileName, filePath, mimeType, foodid);
        });
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback, fileName, filePath,  mimeType, foodid) {
        // console.log("??????????????????????????" + Buffer.from(filePath));
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client, fileName, filePath,  mimeType, foodid);
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

    function addImage(auth, fileName, filePath,  mimeType, foodid) {

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
                connection.query('INSERT INTO images (file_id, food_id) VALUES (?,?)',
                    [fileid, foodid],
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

    function addVideo(auth, fileName, filePath,  mimeType, foodid) {


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
                connection.query('INSERT INTO videos (file_id, food_id) VALUES (?,?)',
                    [fileid, foodid],
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
