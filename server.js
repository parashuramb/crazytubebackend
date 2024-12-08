const express = require("express");
const app = express();
const cors = require("cors");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const YTDlpWrap = require("yt-dlp-wrap-plus").default;
const path = require("path");
const ytDlpWrap = new YTDlpWrap(path.resolve(__dirname, "./yt-dlp.exe"));


app.use(express.json());
app.use(cors());

ffmpeg.setFfmpegPath(ffmpegStatic);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.header("origin"));
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const validOrigin = [
  "http://localhost:4200",
  "https://localhost:4200",
  "localhost:3001",
  "https://crazytube-be.onrender.com",
  "crazytube-be.onrender.com",
  "https://crazytube.creativebonding.in",
];

const checkOrigin = (url, res) => {
  const isValidOrigin = validOrigin.includes(url);
  if (!isValidOrigin) {
    return res.send("Not allowed!");
  }
  return;
};

app.get("/download", async (req, res) => {
  var URL = req.query.URL;
  var name = req.query.fileName;
  var quality = req.query.quality;
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${
      "crazytube_" +
      encodeURIComponent(name ? name : "video") +
      "_creativebonding"
    }.mp4`
  );
  try {
    let readableStream = ytDlpWrap.execStream([URL, "-f", "best[ext=mp4]"]);
    readableStream.pipe(res);
  } catch (err) {
    console.log("download", err);
  }
});

app.get("/videoInfo", async (request, response) => {
  await checkOrigin(request.headers.origin, response);
  const url = request.query.URL;
  try {
    let metadata = await ytDlpWrap.getVideoInfo(url);
    response.status(200).json(metadata);
  } catch (err) {
    response.status(200).json(err);
  }
});

app.get("/downloadmp3", async (req, res) => {
  try {
    await checkOrigin(req.headers.host, res);
    let { URL, downloadFormat, title } = req.query;

    if (downloadFormat === "audio-only") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${
          "crazytube_" +
          encodeURIComponent(title ? title : "audio") +
          "_creativebonding"
        }.mp3`
      );
      // Set up the command to extract MP3 audio
      let readableStream = ytDlpWrap.execStream([URL, "-f", "best[ext=mp4]"]);
      const ffmpegStream = ffmpeg(readableStream)
        .audioBitrate("128")
        .format("mp3")
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
        });
      ffmpegStream.pipe(res);
    }
  } catch (e) {
    console.log("downloadmp3", e);
  }
});

app.get("/", (request, res) => {
  res.send("running");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

module.exports = app;
// exports.app = functions.https.onRequest(app);
// module.exports.handler = serverless(app);
