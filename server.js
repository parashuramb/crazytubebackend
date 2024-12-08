const express = require("express");
const app = express();
const cors = require("cors");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");

app.use(express.json());
app.use(cors());

ffmpeg.setFfmpegPath(ffmpegStatic);

// List of valid origins
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

// Helper function to get the cookies (user can set this manually)
const getCookies = () => [
  'SESS=your_session_cookie_here',
  'VISITOR_INFO1_LIVE=your_visitor_info_cookie_here'
];

// Middleware to set custom headers and cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.header("origin"));
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/download", async (req, res) => {
  var videoUrl = req.query.URL;
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
    // Get video info and choose the best audio and video streams
    const info = await ytdl.getInfo(videoUrl, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',  // Simulate a browser
          'Cookie': getCookies().join('; ')  // Pass cookies for authentication
        }
      }
    });

    // Find the video format (highest quality with video)
    const videoFormat = info.formats.find((format) => format.hasVideo);
    const audioFormat = info.formats.find((format) => format.hasAudio);

    // Create streams for video and audio
    const videoStream = ytdl(videoUrl, { format: videoFormat });
    const audioStream = ytdl(videoUrl, { format: audioFormat });

    // Set up FFmpeg to combine video and audio
    ffmpeg()
      .input(videoStream)
      .input(audioStream)
      .audioCodec("aac")
      .videoCodec("libx264")
      .format("mp4")
      .output(res) // Output to the response stream
      .on("end", () => {
        console.log("Processing finished.");
      })
      .on("error", (err) => {
        console.error("Error:", err);
        res.status(500).send("Error processing video.");
      })
      .run(); // Start the process
  } catch (err) {
    console.log("download", err);
    res.status(500).send("Error fetching video info.");
  }
});

app.get("/videoInfo", async (request, response) => {
  await checkOrigin(request.headers.origin, response);
  const url = request.query.URL;
  try {
    let metadata = await ytdl.getBasicInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Cookie': getCookies().join('; ')
        }
      }
    });
    response.status(200).json(metadata?.videoDetails);
  } catch (err) {
    response.status(500).json({ error: err.message });
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
      ytdl(URL, {
        quality: "highestaudio",
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Cookie': getCookies().join('; ')
          }
        }
      }).pipe(res);
    }
  } catch (e) {
    console.log("downloadmp3", e);
    res.status(500).send("Error downloading audio.");
  }
});

app.get("/", (request, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;
