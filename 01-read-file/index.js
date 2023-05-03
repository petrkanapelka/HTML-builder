const fs = require('fs');
const path = require('path');
const streamInput = fs.createReadStream(path.join(__dirname,'text.txt'));
streamInput.on('data', (data) => {
    console.log(`${data}`);
  });