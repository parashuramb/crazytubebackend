const express = require("express");
const app = express();
const cors = require("cors");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("@distube/ytdl-core");
const agent = ytdl.createAgent([
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.074713,
    hostOnly: false,
    httpOnly: true,
    name: "HSID",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value: "Aon8rz-CuQ06KxPJS",
    index: 0,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.074795,
    hostOnly: false,
    httpOnly: true,
    name: "SSID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "AdaQCx3lfrn9HmmQG",
    index: 1,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.074821,
    hostOnly: false,
    httpOnly: false,
    name: "APISID",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value: "zS8n9MgorVGjoTnM/ARBCZC3W3Wy3aNgeO",
    index: 2,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.074848,
    hostOnly: false,
    httpOnly: false,
    name: "SAPISID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "Z9epm6nbc_Aj6Sh8/A9habkqvCgs43BgdV",
    index: 3,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.074872,
    hostOnly: false,
    httpOnly: false,
    name: "__Secure-1PAPISID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "Z9epm6nbc_Aj6Sh8/A9habkqvCgs43BgdV",
    index: 4,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.074897,
    hostOnly: false,
    httpOnly: false,
    name: "__Secure-3PAPISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value: "Z9epm6nbc_Aj6Sh8/A9habkqvCgs43BgdV",
    index: 5,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1745321475.316971,
    hostOnly: false,
    httpOnly: true,
    name: "LOGIN_INFO",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "AFmmF2swRQIhAKIhp7x93uDiVbKdJLt7n69pw5ZqjCHnn-L3YSkoucntAiA1_7FwgpIHfqSMd8sfeb42oyL6cM9-Y_IVbytTSu5h-A:QUQ3MjNmeGc2dmN2cGlIb1RHdU5McTEwYkJKSlYzc2g4Z2JGSEtpS2d0NnRXREo2UzRSVjhrNEptb0YxNWx3dmkxS1ZBc1dfLUcyeDJBRFNCSUJralVFYUZWdUkzM0dBSG4zY1Nab3paMXI2Zk1ZQjlrendkcktvMWtiS1pJT2NOMmI3VUJoaDZKWkxmTmo4RC1wWmRMOXVXaGp3Rl9sRVp3",
    index: 6,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1768292891.079244,
    hostOnly: false,
    httpOnly: false,
    name: "PREF",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: "f6=40000000&f7=4100&tz=Asia.Calcutta&f4=4000000&f5=30000",
    index: 7,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.075074,
    hostOnly: false,
    httpOnly: false,
    name: "SID",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value:
      "g.a000qghG3QRRdNB135yEeF-cpq5lVo0Lbc5qOQZw8rtfd6qFj4sVZpWAQEcIiEpe1GobVz6M_AACgYKAToSARMSFQHGX2MiwUS3sSihrHuy4D57oRx6ExoVAUF8yKrNuxibSJm4FLmlxN9n9Y2q0076",
    index: 8,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.075101,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSID",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "g.a000qghG3QRRdNB135yEeF-cpq5lVo0Lbc5qOQZw8rtfd6qFj4sVH771TBNAauBA6tcn3Sr6OAACgYKAWwSARMSFQHGX2MiD0YDjVRXt44tTXTrsZmK1RoVAUF8yKrTlqZjPGFHuW3r9bKwbAb10076",
    index: 9,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1766774185.075124,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "g.a000qghG3QRRdNB135yEeF-cpq5lVo0Lbc5qOQZw8rtfd6qFj4sVv4smlta040LCPv1wq4_WpgACgYKARYSARMSFQHGX2Mic0WZJkPflB5BzwDSpWj-MhoVAUF8yKoPgaEnQp5Rqrf2I5XvdERa0076",
    index: 10,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1733732896,
    hostOnly: false,
    httpOnly: false,
    name: "ST-xuwub9",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value:
      "session_logininfo=AFmmF2swRQIhAKIhp7x93uDiVbKdJLt7n69pw5ZqjCHnn-L3YSkoucntAiA1_7FwgpIHfqSMd8sfeb42oyL6cM9-Y_IVbytTSu5h-A%3AQUQ3MjNmeGc2dmN2cGlIb1RHdU5McTEwYkJKSlYzc2g4Z2JGSEtpS2d0NnRXREo2UzRSVjhrNEptb0YxNWx3dmkxS1ZBc1dfLUcyeDJBRFNCSUJralVFYUZWdUkzM0dBSG4zY1Nab3paMXI2Zk1ZQjlrendkcktvMWtiS1pJT2NOMmI3VUJoaDZKWkxmTmo4RC1wWmRMOXVXaGp3Rl9sRVp3",
    index: 11,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1765268893.438922,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDTS",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "sidts-CjIBQT4rX6Yj0FHSjJ4_E4p3ackao7-OjynB9qZazdygP9BxZGvFepCt9CNeOna96UwdXBAA",
    index: 12,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1765268893.439012,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDTS",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "sidts-CjIBQT4rX6Yj0FHSjJ4_E4p3ackao7-OjynB9qZazdygP9BxZGvFepCt9CNeOna96UwdXBAA",
    index: 13,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1765268893.439045,
    hostOnly: false,
    httpOnly: false,
    name: "SIDCC",
    path: "/",
    sameSite: "unspecified",
    secure: false,
    session: false,
    storeId: "0",
    value:
      "AKEyXzXdAJzWajeB_F4TwFB5XE7Nwq8rwic99oFJqewh6DnPhyPWk45Xu0ymWCfQZcA2NY7JE5Xk",
    index: 14,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1765268893.439074,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDCC",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "AKEyXzVRg1LTycVO9ndI1lyt5TpQqqBOHkPCn_1Gjut_K_c6IbH9PBOi-EmWWQCLQuTpMmEdHsg",
    index: 15,
    isSearch: false,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1765268893.439098,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDCC",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value:
      "AKEyXzXbNQ8KNAxlCGzlUFyMxCHEWGcRogltf2eq3MkAlbBA7VXuQrbeRaK6_CNV_sQHgSoAKu34",
    index: 16,
    isSearch: false,
  },
]);

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
    const info = await ytdl.getInfo(videoUrl);
    // Find the video format (highest quality with video)
    const videoFormat = info.formats.find((format) => format.hasVideo);

    ytdl(videoUrl, {
      format: videoFormat,
      agent,
    }).pipe(res);
  } catch (err) {
    console.log("download", err);
  }
});

app.get("/videoInfo", async (request, response) => {
  await checkOrigin(request.headers.origin, response);
  const url = request.query.URL;
  try {
    let metadata = await ytdl.getBasicInfo(url, { agent });
    response.status(200).json(metadata?.videoDetails);
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
      // ytdl(URL, {
      //   quality: "highestaudio",
      //   agent,
      // }).pipe(res);

      const stream = ytdl(URL, { Filter: "audioonly" });
      const ffmpegStream = ffmpeg(stream)
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
