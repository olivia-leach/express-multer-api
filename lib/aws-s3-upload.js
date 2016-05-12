'use strict';

// loads the .env file from the home directory
const crypto = require('crypto');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

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

const awsS3Upload = (file) =>

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

module.exports = awsS3Upload;
