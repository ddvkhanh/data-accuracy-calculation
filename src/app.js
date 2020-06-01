const express = require("express");
const path = require("path");
const hbs = require("hbs");
const fs = require("fs");
const neatCsv = require("neat-csv");
const upload = require("./utils/upload");
const helpers = require("./utils/helpers");

const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const imagePath = path.join(__dirname, "../images");
const logcountCSVPath = path.join(__dirname, "../logcountCSV");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectory));
app.use("/images", express.static(imagePath));
app.use("/logcountCSV", express.static(logcountCSVPath));
hbs.registerHelper("convert", function (data) {
  if (!data) {
    return;
  }
  return JSON.stringify(data);
});

app.get("", (req, res) => {
  res.render("index", {
    title: "About",
    name: "Digitals Innovation Lab",
  });
});

app.get("/logcount", (req, res) => {
  res.render("logcount", {
    title: "Log count",
    name: "Digital Innovation Lab",
  });
});

app.get("/volume", (req, res) => {
  res.render("volume", {
    title: "Volume calculator",
    name: "Digital Innovation Lab",
    referenceData: helpers.staticRecords,
  });
});

app.get("/reference-records", (req, res) => {
  res.json(helpers.staticRecords);
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Digital Innovation Lab",
    errorMsg: "Page not found",
  });
});

//upload image
const uploadImage = upload.uploadImage();

app.post(
  "/upload-log-image",
  uploadImage.single("log-image"),
  (req, res) => {
    const filePath = req.file.path;
    fs.readFile(filePath, (error, data) => {
      if (error) {
        return console.log("error reading file");
      }
    });
    // TODO: replace this with actual result from python
    const processedImageUrl = `/images/comp-generated-img/processed-img.png`
    res.send({
      data: helpers.barcodeAndSEDMAp,
      processedImageUrl
    });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.post(
  "/upload-vol-log-image",
  uploadImage.single("log-vol-image"),
  (req, res) => {
    const filePath = req.file.path;
    console.log(filePath);
    fs.readFile(filePath, (error, data) => {
      if (error) {
        return console.log("error reading file");
      }
    });
    // TODO: replace this with actual result from python
    res.send(helpers.staticRecords);
  },
  (error, req, res, next) => {
    console.log("file loading...");
    res.status(400).send({ error: error.message });
  }
);

//upload csv file
const uploadCSV = upload.uploadCSV();

app.post(
  "/upload-log-count-csv-file2",
  uploadCSV.single("log-count-csv-file"),
  async (req, res) => {
    const filePath = req.file.path;
    fs.readFile(filePath, (error, data) => {
      if (error) {
        return console.log("error reading file");
      }
      neatCsv(data).then((parsedData) => {
        const dataJSON = JSON.stringify(parsedData, null, 2); //write a response to the client
        fs.writeFileSync("logs.json", dataJSON);
      });
    });
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
