const multer = require("multer");


//upload image file
uploadImage = () =>
  multer({
    dest: "images/user-input-img",
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        return cb(new Error("Please upload an image you dumb fuckery"));
      }
      cb(undefined, true);
    },
  });

//upload CSV file
uploadCSV = () =>
  multer({
    dest: "logcountCSV",
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
