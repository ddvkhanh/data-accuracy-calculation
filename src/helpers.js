const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;

// const express = require('express')
// const path = require('path')
// const hbs = require('hbs')
// const multer = require('multer')
// const helpers = require('./helpers');


// const app = express()
// const port = process.env.PORT || 3000
// app.use(express.static(__dirname + '/public'));


// //Define paths for Express config
// const publicDirectory = path.join(__dirname, '../public')
// const viewsPath = path.join(__dirname, '../templates/views')
// const partialsPath = path.join(__dirname, '../templates/partials')

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//       cb(null, 'uploads/');
//   },

//   // By default, multer removes file extensions so let's add them back
//   filename: function(req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// //Setup handlebars engine and views location
// app.set('view engine', 'hbs')
// app.set('views', viewsPath)
// hbs.registerPartials(partialsPath)

// //Setup static directory to serve
// app.use(express.static(publicDirectory))

// app.get('', (req, res) => {
//   res.render('index', { 
//     title: 'About',
//     name: 'Digitals Innovation Lab',
//   })
// })

// app.get('/logcount', (req, res) => {
//   res.render('logcount', {
//     title: 'Log count',
//     name: 'Digital Innovation Lab',
//   })
// })

// app.get('/volume', (req, res) => {
//     res.render('volume', {
//       title: 'Volume calculation',
//       name: 'Digital Innovation Lab',
//     })
//   })


// app.get('*', (req, res) => {
//   res.render('404', {
//     title: '404',
//     name: 'Digital Innovation Lab',
//     errorMsg: 'Page not found',
//   })
// })

// app.post('/upload-log-image', (req, res) => {
//   // 'profile_pic' is the name of our file input field in the HTML form
//   let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('log-image');

//   upload(req, res, function(err) {
//       // req.file contains information of uploaded file
//       // req.body contains information of text fields, if there were any

//       if (req.file) {
//         return res.send('File uploading')
//       }
//       else if (req.fileValidationError) {
//           return res.send(req.fileValidationError);
//       }
//       else if (!req.file) {
//           return res.send('Please select an image to upload');
//       }
//       else if (err instanceof multer.MulterError) {
//           return res.send(err);
//       }
//       else if (err) {
//           return res.send(err);
//       }

//       // Display uploaded image for user validation
//       res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
//   });
// });

// app.listen(port, () => {
//   console.log('Server is up on port ' + port)
// });
