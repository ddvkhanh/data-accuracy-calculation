//Last update: 3/6/2020
//This file contains multer settings for uploading Image and CSV file
//Functions in this file are called in app.js

const multer = require("multer");


//@upload and validate image file
//@image will be stored in folder user-input-img
uploadImage = () =>
  multer({
    dest: "images/user-input-img",
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        return cb(new Error("Please upload an image "));
      }
      cb(undefined, true);
    },
  });

//@upload and validate CSV file

uploadCSV = () =>
  multer({
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(csv)$/)) {
        return cb(new Error("Please upload a csv file"));
      }
      cb(undefined, true);
    },
  });

module.exports = {
  uploadCSV,
  uploadImage,
};
