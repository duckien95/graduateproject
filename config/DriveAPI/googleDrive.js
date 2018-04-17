function googleDrive() {
    this.greeting = function(name){
        return 'hello' + name;
    };

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


    var Buffer = require('buffer/').Buffer;

    // Load client secrets from a local file.

    this.uploadVideo = function(fileName, filePath, mimeType) {
        fs.readFile('client_secret.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), addVideo, fileName, filePath, mimeType);
        });
    }

    this.uploadImage = async function(fileName, filePath, mimeType) {
        fs.readFile('client_secret.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            // authorize(JSON.parse(content), listFiles);
            authorize(JSON.parse(content), addImage, fileName, filePath, mimeType);
        });
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    async function authorize(credentials, callback, fileName, filePath,  mimeType) {
        // console.log("??????????????????????????" + Buffer.from(filePath));
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client, fileName, filePath,  mimeType);
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


/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
    function listFiles(auth) {
        const drive = google.drive({ version: 'v3', auth });
        drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        }, (err, {data}) => {
            console.log(JSON.stringify(data, null, 2));
            if (err) return console.log('The API returned an error: ' + err);
                const files = data.files;
            if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
            } else {
                console.log('No files found.');
            }
        });
    }

    async function addImage(auth, fileName, filePath,  mimeType) {


        // console.log("++++++++++++++++" + fileName);
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
        },async function(err, file) {
            if (err) {
        // Handle error
                console.error(err);
            } else {
                // console.log(file);
                console.log('File Id: ',file.data.id);
                return file.data.id;
            }
        });

    }

    function addVideo(auth, fileName, filePath,  mimeType) {


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
                return file.data.id;
            }
        });

    }

    return this;

}

module.exports = googleDrive;