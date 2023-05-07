const fs = require ('fs');
const path = require ('path');
const fsPromises = fs.promises;

const dirEntries = fsPromises.readdir(path.join(__dirname,'secret-folder'), {withFileTypes: true});
dirEntries.then((values)=>{
  for (let value of values) {
    if (!value.isDirectory()) {
      const filePath = path.join(__dirname, 'secret-folder',value.name);
      const fileName = path.basename (filePath);
      const ext = path.extname(filePath);
      const fileStats = fsPromises.stat(filePath);
      fileStats.then ((stats)=>{
        console.log(`${fileName.replace(ext,'')}- ${ext.replace('.','')} - ${+(stats.size/1024).toFixed(3)}kb`);
      })
    }
  }
})