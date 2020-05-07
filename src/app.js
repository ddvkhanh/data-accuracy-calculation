const express = require("express");
const path = require("path");
const hbs = require("hbs");
const multer = require("multer");
const helpers = require("./helpers");

const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const imagePath = path.join(__dirname, "../images");
const logcountCSVPath=path.join(__dirname,"../logcountCSV");

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
const uploadImage = multer({
  dest: "images",
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      return cb(new Error("Please upload an imaget"));
    }
    cb(undefined, true);
  },
});

app.post(
  "/upload-log-image",
  (req,res, next)  => {
    uploadImage.single("log-image")(req,res,function(err){
      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      } else if (!req.file) {  
        return res.send("Please select an image to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
  
      // Display uploaded image for user validation
      res.send(
        // `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./logcount">Upload another image</a>`
      );
    })
  }
);


//upload csv file
const uploadCSV = multer({
  dest: "logcountCSV",
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error("Please upload a csv file"));
    }
    cb(undefined, true);
  },
});

app.post(
  "/upload-log-count-csv-file",
  (req,res, next)  => {
    uploadCSV.single("log-count-csv-file")(req,res,function(err){
      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      } else if (!req.file) {  
        return res.send("Please select a csv file to upload");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
  
      res.send(req.file
        // `You have uploaded this file: ${req.originalname}><hr /><a href="./logcount">Upload another file</a>`
      );
    })
  }
);



app.listen(port, () => {
  console.log("Server is up on port " + port);
});
