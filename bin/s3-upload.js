'use strict';

// loads the .env file int the environment
require('dotenv').config();

// require node modules
const fs = require('fs');
// https://www.npmjs.com/package/file-type
const fileType = require('file-type');

const awsS3Upload = require('../lib/aws-s3-upload.js');

const mongoose = require('../app/middleware/mongoose');
const Upload = require('../app/models/upload');

const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
    // most generic content type. data shouldn't be interpreted as anything (image, etc.)
}, fileType(data));

// get filename from command line or assign it as an empty string
// empty string avoids fs.readFile blowing up
let filename = process.argv[2] || '';
let title = process.argv[3] || 'No Title';

const readFile = (filename) =>
  new Promise((resolve, reject) => {
    // fs.readFile takes filename and callback
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

// readFile() returns a promise
readFile(filename)
  .then((data) => {
    let file = mimeType(data);
    file.data = data;
    return file;
  })
  .then(awsS3Upload)
  .then((s3response) => {
    let upload = {
      location: s3response.Location,
      title: title,
    };
    return Upload.create(upload);
  })
  .then(console.log)
  .catch(console.error)
  .then(() => mongoose.connection.close());
