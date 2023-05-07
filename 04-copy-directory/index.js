const fs = require ('fs');
const path = require ('path');
const fsPromises = require('fs').promises;

fsPromises.mkdir(path.join(__dirname,'files-copy'), { recursive: true });
fs.readdir(path.join(__dirname,'files-copy'), (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(path.join(__dirname,'files-copy'), file), err => {
      if (err) throw err;
    });
  }
})
let entries = fsPromises.readdir(path.join(__dirname,'files'), { withFileTypes: true });
entries.then ((values)=>{
  for (let entry of values) {
    let srcPath = path.join(path.join(__dirname,'files'), entry.name);
    let destPath = path.join(path.join(__dirname,'files-copy'), entry.name);
    fsPromises.copyFile(srcPath, destPath);
  }
})