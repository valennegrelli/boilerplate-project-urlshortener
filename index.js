require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
let psl = require("psl");
let bodyParser = require("body-parser");

//---------------AUX FUNCTIONS-------------//

// function extractHostname(url) {
//   var hostname;
//   //find & remove protocol (http, ftp, etc.) and get hostname

//   if (url.indexOf("//") > -1) {
//     hostname = url.split("/")[2];
//   } else {
//     hostname = url.split("/")[0];
//   }

//   //find & remove port number
//   hostname = hostname.split(":")[0];
//   //find & remove "?"
//   hostname = hostname.split("?")[0];

//   return hostname;
// }

//-----------------APP-------------------//

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({greeting: "hello API"});
});

let ShortenedURLs = {};
let index = 0;

const urlEncodedDataMware = bodyParser.urlencoded({extended: false});
app.use(urlEncodedDataMware);

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  const hostname = new URL(url).hostname;
  // psl.get(extractHostname(url));
  console.log(url);
  dns.lookup(hostname, function (err, address, family) {
    if (!err) {
      ShortenedURLs[url] = index;
      res.json({original_url: url, shorturl: index});
      index++;
    } else {
      res.json({error: "Invalid URL"});
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
