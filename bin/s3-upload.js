'use strict';

// require node fs module
const fs = require('fs');

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
  .then( (data) => console.log(`${filename} is ${data.length} bytes long.`))
  .catch( console.error );
