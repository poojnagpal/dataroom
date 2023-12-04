// /api/upload-file.js
const AWS = require('aws-sdk');
const multer = require('multer');

// Configure AWS SDK here as needed

const upload = multer({ storage: multer.memoryStorage() }).single('file');

module.exports = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    // req.file is the `file` file
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file was uploaded.');
    }

    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.S3_BUCKET_NAME, // Set the correct environment variable
      Key: file.originalname, // The name of the file in S3
      Body: file.buffer, // The file buffer from multer
      ContentType: file.mimetype, // File MIME type
    };

    // Use s3 to upload the file
    s3.upload(params, (s3Err, data) => {
      if (s3Err) {
        console.error(s3Err);
        return res.status(500).send('Error uploading to S3');
      }
      res.send({ message: 'File uploaded successfully', data });
    });
  });
};
