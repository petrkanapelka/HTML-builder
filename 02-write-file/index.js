const fs = require('fs');
const path = require('path');
const {stdin, stdout, exit} = require('process');
const newPath = path.join(__dirname,'text.txt');
const streamWritten = fs.createWriteStream(newPath);
stdout.write('Hello, please enter the text: \n');
stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
        stdout.write('\nGood bye');
        exit();
    }
    streamWritten.write(data);
  });

  process.on('SIGINT',()=>{
    stdout.write('\nGood bye');
    exit();
  });