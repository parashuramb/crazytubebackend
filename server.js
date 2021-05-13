const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
app.use(express.json());
app.use(cors());
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

let id = 'sDLsSQf3Hc0';


app.get('/download', (req, res) => {
    var URL = req.query.URL;
    var name = req.query.fileName;
    var quality = req.query.quality;
    res.header('Content-Disposition', `attachment; filename="${name}.mp4"`);
    ytdl(URL, {
        filter: format => (format.quality === quality && format['hasAudio'])
    }).pipe(res);
});

app.get("/videoInfo", async function (request, response) {
    const url = request.query.URL;
    const info = await ytdl.getInfo(url);
    response.status(200).json(info);
});


// app.get('/mp3', async (req, res) => {
//     console.log('called');
//     var URL = req.query.URL;
//     var name = req.query.fileName;
//     var quality = req.query.quality;
//     var audioBitrate = req.query.audioBitrate;
//     var audioQuality = req.query.audioQuality;
//     var mp3formats = req.query.mp3formats;
//     var itag = req.query.itag;
//     console.log('mp3formats', audioQuality, mp3formats, itag);
//     if (mp3formats) {
//         res.setHeader(
//             'Content-Disposition',
//             `attachment; filename=${name}.mp3`,
//         );
//         ytdl(URL, {
//             filter: format => format['itag'] == itag
//         }).pipe(writeableStream);
//     }
// });

app.get("/mp3", function (request, response) {
    const videoURL = request.query.videoURL;
    const itag = request.query.itag;
    console.log('itag', itag);
    response.header("Content-Disposition", 'attachment;\ filename="video.mp3"');
    ytdl(videoURL, {
        filter: format => format.itag == itag
    }).pipe(response);
});

app.get('/downloadmp3', async (req, res) => {
    try {
        const {
            URL,
            downloadFormat,
            quality,
            title,
        } = req.query;
        console.log(URL, downloadFormat, quality, title);

        res.header("Content-Disposition", 'attachment;\ filename=youloads.mp3');

        ytdl(URL, {
            // quality: 'highestaudio',
            filter: 'audioonly',
        }).pipe(res);


        // if (downloadFormat === 'audio-only') {
        //     res.setHeader(
        //         'Content-Disposition',
        //         `attachment; filename=${title}.mp3`,
        //     );

        //     ytdl.getInfo(URL, {
        //         quality: 'highest'
        //     }, function (err, info) {
        //         const stream = ytdl.downloadFromInfo(info, {
        //                 quality: 'highest',
        //                 requestOptions: {
        //                     maxRedirects: 5
        //                 }
        //             })
        //             .pipe(file);
        //     });

        //     // let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        //     ytdl(URL, {
        //         filter: format => format. === 'm4a' && !format.encoding
        //     }).pipe(res);
        // }
    } catch (e) {
        console.log(e);
    }
});






const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

module.exports = app;