'use strict';

// require node fs module
const fs = require('fs');

// get filename from command line or assign it as an empty string
// empty string avoids fs.readFile blowing up
let filename = process.argv[2] || '';

// fs.readFile takes filename and callback
fs.readFile(filename, (err, data) => {
  if (err) {
    return console.error(err);
  }

  console.log(`${filename} is ${data.length} bytes long.`);
});
