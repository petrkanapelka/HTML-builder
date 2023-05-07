const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;



function unlinkFile () {
    fs.unlink(path.join(__dirname, 'project-dist','bundle.css'), (err) => {
        if(err) throw err;
        console.log('File deleted successfully!');
    });
}
function openFile () {
    fs.open(path.join(__dirname, 'project-dist','bundle.css'), 'w', (err) => {
        if(err) throw err;
        console.log('File created');
    });
}

fs.access(path.join(__dirname, 'project-dist','bundle.css'), fs.F_OK, (err) => {
    if (err) {
        openFile();
        console.log ('File does not exists!');
      return
    } else {
        unlinkFile();
        console.log('File exists!');
    }
})

const dirEntries = fsPromises.readdir(path.join(__dirname,'styles'), {withFileTypes: true});
dirEntries.then((values)=>{
  for (let value of values) {
    if (value.isFile()) {
      const filePath = path.join(__dirname, 'styles',value.name);
      const ext = path.extname(filePath);
      const fileName = path.basename (filePath);
      if (ext === '.css') {
          const streamInput = fs.createReadStream(filePath);
            streamInput.on('data', (data) => {
                fs.appendFile(path.join(__dirname, 'project-dist','bundle.css'), data, (err) => {
                    if(err) throw err;
                    console.log(`${fileName} has been added!`);
                });
            });
      }
    }
  }
})