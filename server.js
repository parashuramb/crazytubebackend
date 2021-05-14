const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const ytdl = require('ytdl-core');

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
            title,
        } = req.query;
        console.log(URL, downloadFormat, title);
        const attachment = `attachment;\ filename=${title}.mp3`;
        res.header("Content-Disposition", attachment);

        ytdl(URL, {
            // quality: 'highestaudio',
            filter: 'audioonly',
        }).pipe(res); 
    } catch (e) {
        console.log(e);
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

module.exports = app;