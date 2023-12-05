const express = require('express');
const app = express();
require('dotenv').config({ path: '../.env' });

const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const session = require('express-session');

// // Configure the Google strategy for use by Passport.
// passport.use(new GoogleStrategy({
//     clientID: '971196842332-pd1b4tviei8l21fov0n6g5i9ae2kv5di.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: 'http://localhost:3000/dataroom'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // Here you would find or create a user in your database
//     done(null, profile);
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });


// app.use(session({ secret: 'anything' }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Route to start OAuth flow
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// // OAuth callback url
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect to the data room.
//     res.redirect('/dataroom');
//   }
// );


const PORT = process.env.PORT || 3001; // Set your server port here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(express.static(path.join(__dirname, 'public')));

const frontendURL = 'https://exquisite-piroshki-a74ed5.netlify.app/';

app.use(cors({
  origin: frontendURL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (cookies, authorization headers, etc.) if needed
}));




AWS.config.update({
    accessKeyId: process.env.MYAPP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MYAPP_AWS_SECRET_ACCESS_KEY,
    region: process.env.MYAPP_AWS_REGION // For example, 'us-west-2'
  });

  const upload = multer({ storage: multer.memoryStorage() });

  
 const s3 = new AWS.S3();
 // Serve static files from the React app
app.use(express.static(path.join(__dirname, 'path/to/your/react-app/build')));



// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'path/to/your/react-app/build', 'index.html'));
// });



//  const upload = multer({
//   dest: 'uploads/' // This will save files to a folder 'uploads' in your project directory
//   // You might configure it differently, e.g., to keep files in memory if uploading to S3
// });


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/create-folder', (req, res) => {
    const { folderName } = req.body; // e.g., '2023/reports/'
    const params = {
      Bucket: YOUR_BUCKET_NAME,
      Key: `${folderName}/`, // The trailing slash is important
      Body: '', // Empty content
      ContentType: 'application/x-directory' // Custom MIME type for a directory
    };
  
    s3.putObject(params, function(err, data) {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ success: true, message: 'Folder created', data: data });
    });
  });
  
  app.get('/view-file', (req, res) => {
    const fileName = decodeURIComponent(req.query.fileName);
  
    const params = {
      Bucket: process.env.S3_BUCKET, // Your bucket name
      Key: fileName,
      Expires: 3600, // URL expires in 60 seconds
    };
  
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        console.error('Error generating file URL', err);
        return res.status(500).json({ error: 'Unable to generate file URL' });
      }
      res.json({ url });
    });
  });




app.post('/upload-file', upload.single('file'), (req, res) => {
  const file = req.file;
  console.log('something', process.env.AWS_SECRET_ACCESS_KEY)

  console.log(file)
  if (!file) {
    return res.status(400).send('No file was uploaded.');
  }

  const params = {
    Bucket: "harveydataroom", // Your bucket name
    Key: file.originalname, // The name of the file in S3
    Body: file.buffer, // The file buffer from Multer
    ContentType: file.mimetype, // File MIME type
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading to S3');
    }

    res.send({ message: 'File uploaded successfully', data });
  });
});

app.post('/create-folder', (req, res) => {
  const { folderName } = req.body;
  const s3 = new AWS.S3();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folderName}/`, // The trailing slash is important for "folders"
  };
  
  s3.putObject(params, (err, data) => {
    if (err) {
      console.error('Error creating folder:', err);
      res.status(500).send('Error creating folder');
    } else {
      res.status(200).send(`Folder '${folderName}' created successfully`);
    }
  });
});

  

  
// app.get('/view-file/:filename', (req, res) => {
//     const filename = req.params.filename;
//     // Placeholder for file retrieval logic
//     res.send(`Viewing file: ${filename}`);
//   });

app.put('/update-file/:filename', (req, res) => {
    const filename = req.params.filename;
    // Placeholder for file update logic
    res.send(`File ${filename} updated`);
  });

app.delete('/delete-file/:filename', (req, res) => {
    const filename = req.params.filename;
    // Placeholder for file deletion logic
    res.send(`File ${filename} deleted`);
  });
  
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'public', 'index.html'));
  // });
  

