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
    name = removeEmoji(name);
    console.log(name)
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
 

app.get('/downloadmp3', async (req, res) => {
    try {
        let {
            URL,
            downloadFormat,
            title,
        } = req.query;
        // console.log(URL, downloadFormat, title);
        title = removeEmoji(title);
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

function removeEmoji(str) {
    var ranges = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
      ];
      
    return   str = str.replace(new RegExp(ranges.join('|'), 'g'), '');
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

module.exports = app;