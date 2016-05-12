'use strict';

// loads the .env file int the environment
require('dotenv').config();

// require node modules
const fs = require('fs');
// https://www.npmjs.com/package/file-type
const fileType = require('file-type');

const awsS3Upload = require('../lib/aws-s3-upload.js');

const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
    // most generic content type. data shouldn't be interpreted as anything (image, etc.)
}, fileType(data));

// get filename from command line or assign it as an empty string
// empty string avoids fs.readFile blowing up
let filename = process.argv[2] || '';

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
  .then((s3response) => console.log(s3response))
  .catch( console.error );
