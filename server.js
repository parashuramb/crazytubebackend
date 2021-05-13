const express = require("express");
const app = express();
const cors = require("cors");
var ffmpeg = require('fluent-ffmpeg');
app.use(express.json());
app.use(cors());
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const ytdl = require('ytdl-core');

app.get('/download', (req, res) => {
    var URL = req.query.URL;
    var name = req.query.fileName;
    var quality = req.query.quality;
    res.header('Content-Disposition', `attachment; filename="${name}.mp4"`);
    ytdl(URL, {
        filter: format => format.quality === quality
    }).pipe(res);
});

app.get("/videoInfo", async function (request, response) {
    const url = request.query.URL;
    const info = await ytdl.getInfo(url);
    response.status(200).json(info);
});
 

app.get('/mp3', async (req, res) => {
    console.log('called');
    var URL = req.query.URL;
    var name = req.query.fileName;
    var quality = req.query.quality;
    var mp3formats = req.query.mp3formats;
    if (mp3formats) {
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${name}.mp3`,
        );
        ytdl(URL, {
            filter: format => (format['hasAudio'] && !format['hasVideo'] && format.audioCodec ===  mp3formats),
        }).pipe(res);
    }
});


// app.get('/mp3', (req, res) => {

//     var URL = req.query.URL;
//     var fileName = req.query.fileName;
//     var quality = req.query.quality;
//     //set stream for conversion
//     var stream = ytdl(URL)


//     //set response headers
//     res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '.mp3');
//     res.setHeader('Content-type', 'audio/mpeg');


//     var proc = new ffmpeg({
//         source: stream
//     });

//     proc.withAudioCodec('libmp3lame')
//         .on("end", function (stdout, stderr) {
//             console.log("Finished");
//             res.download(__dirname + fileName, function (err) {
//                 if (err) throw err;

//                 fs.unlink(__dirname + fileName, function (err) {
//                     if (err) throw err;
//                     console.log("File deleted");
//                 });
//             });
//             fs.unlink("tmp/" + fileName, function (err) {
//                 if (err) throw err;
//                 console.log("File deleted");
//             });
//         })
//         .on("error", function (err) {
//             console.log("an error happened: " + err.message);
//             fs.unlink("tmp/" + fileName, function (err) {
//                 if (err) throw err;
//                 console.log("File deleted");
//             });
//         })
//         .saveToFile(__dirname + fileName);


// })

// app.get("/download",function(request,response){
// 	const videoURL = request.query.url;
// 	const itag = request.query.itag;
// 	response.header("Content-Disposition",'attachment;\ filename="video.mp4"');
// 	ytdl(videoURL,{format: 'mp4'
// 	}).pipe(writeableStream);
// });


// const writeableStream = fs.createWriteStream(`sample.mp4`);
// writeableStream .on('finish', () => {
//     console.log(`downloaded successfully`);
//   });
// our sever is listening on port 3001 if we're not in production

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

module.exports = app;