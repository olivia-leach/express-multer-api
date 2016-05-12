'use strict';

// require node modules
const fs = require('fs');
// https://www.npmjs.com/package/file-type
const fileType = require('file-type');

const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
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

const awsUpload = (file) => {
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  const options = {
    ACL: 'public-read',
    Body: file.data,
    Bucket: 'olliiviia',
    ContentType: file.mime,
    // most generic content type. data shouldn't be interpreted as anything (image, etc.)
    Key: `test/test.${file.ext}`, // path that gets set up by S3
  };
  // Promise.resolve creates a new promise that is resolved with whatever you pass to it
  return Promise.resolve(options);
};

// readFile() returns a promise
readFile(filename)
  .then((data) => {
    let file = mimeType(data);
    file.data = data;
    return file;
  })
  .then(awsUpload)
  .then((options) => console.log(options))
  .catch( console.error );
