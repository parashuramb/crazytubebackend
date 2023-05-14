const express = require("express");
const app = express();
const cors = require("cors");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
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
      "crazytube_" + encodeURIComponent(name) + "_creativebonding"
    }.mp4`
  );
  try {
    ytdl(URL, {
      filter: (format) => {
        return format.quality === quality && format["hasAudio"];
      },
    }).pipe(res); 
  } catch (err) {
    console.log(err);
  }
});

app.get("/videoInfo", async (request, response) => {
  await checkOrigin(request.headers.origin, response);
  const url = request.query.URL;
  try {
    const info = await ytdl.getInfo(url);
    response.status(200).json(info);
  } catch (err) {
    console.log(err);
    const info = await ytdl.getInfo(url);
    response.status(200).json(info);
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
          "crazytube_" + encodeURIComponent(title) + "_creativebonding"
        }.mp3`
      );
      const stream = ytdl(URL, {
        filter: (format) => {
          return format["hasAudio"];
        },
      });
      ffmpeg(stream)
        .audioBitrate("128")
        .format("mp3")
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
        })
        .pipe(res, { end: true });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/", (request, res) => {
  res.send("running");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

// module.exports = app;
// exports.app = functions.https.onRequest(app);
// module.exports.handler = serverless(app);
