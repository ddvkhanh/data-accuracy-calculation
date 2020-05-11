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
    title: "Volume calculation",
    name: "Digital Innovation Lab",
  });
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

app.post("/upload-log-image", (req, res, next) => {
  uploadImage.single("log-image")(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation
    res.send(
      `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr />Go back to continue`
    );
  });
});

//upload csv file
const uploadCSV = upload.uploadCSV();

app.post("/upload-log-count-csv-file", async (req, res, next) => {
  console.log("request", req.files);
  uploadCSV.single("log-count-csv-file")(req, res, function (err) {
    const filePath = req.file.path;
    fs.readFile(filePath, (error, data) => {
      if (error) {
        return console.log("error reading file");
      }
      neatCsv(data).then((parsedData) => {
        const dataJSON = JSON.stringify(parsedData, null, 2); //write a response to the client
        fs.writeFileSync("logs.json", dataJSON);
        res.send(req.file);
      });
    });
  });
});

app.post(
  "/upload-log-count-csv-file2",
  uploadCSV.single("log-count-csv-file"),
  async (req, res, next) => {
    console.log("request", req.file);

    const filePath = req.file.path;
    fs.readFile(filePath, (error, data) => {
      if (error) {
        return console.log("error reading file");
      }
      neatCsv(data).then((parsedData) => {
        const dataJSON = JSON.stringify(parsedData, null, 2); //write a response to the client
        fs.writeFileSync("logs.json", dataJSON);
        res.send(req.file);
      });
    });
  }
);

//extract file JSON
const logcount = helpers.extractCSV("logs.json");
logcount.forEach((log) => console.log(log.BarCode));

//extract computer generated CSV file

const computerCount = helpers.calculateLogCount();

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
