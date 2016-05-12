'use strict';

// loads the .env file int the environment
require('dotenv').config();

// require node modules
const fs = require('fs');
// https://www.npmjs.com/package/file-type
const fileType = require('file-type');
const AWS = require('aws-sdk');
const crypto = require('crypto');

const s3 = new AWS.S3();

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

  const randomHexString = (length) =>
  // use crypto to generate a random string for key
  new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString('hex'));
      }
    });
  });

const awsUpload = (file) =>

  randomHexString(16)
  .then((filename) => {
    // assign directory to today's date
    let dir = new Date().toISOString().split('T')[0];

    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    return {
      ACL: 'public-read',
      Body: file.data,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ContentType: file.mime,
      Key: `${dir}/${filename}.${file.ext}`, // path that gets set up by S3
    };
  }).then(params =>
    new Promise((resolve, reject) => {
         s3.upload(params, (err, data) => {
           if (err) {
             reject(err);
           } else {
             resolve(data);
           }
         });
       })
     );

// readFile() returns a promise
readFile(filename)
  .then((data) => {
    let file = mimeType(data);
    file.data = data;
    return file;
  })
  .then(awsUpload)
  .then((s3response) => console.log(s3response))
  .catch( console.error );
