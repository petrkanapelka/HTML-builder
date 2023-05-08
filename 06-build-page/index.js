const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

//  Merge styles
function unlinkFile (pathFile) {
    fs.unlink(pathFile, (err) => {
        if(err) throw err;
    });
}
function openFile (pathFile) {
    fs.open(pathFile, 'w', (err) => {
        if(err) throw err;
    });
}

function accessFile (pathFile) {
    fs.access(pathFile, fs.F_OK, (err) => {
        if (err) {
            openFile(pathFile);
          return
        } else {
            unlinkFile(pathFile);
            openFile(pathFile);
        }
    })
}
fsPromises.mkdir(path.join(__dirname,'project-dist'), { recursive: true });

accessFile (path.join(__dirname, 'project-dist','style.css'));

const dirEntries = fsPromises.readdir(path.join(__dirname,'styles'), {withFileTypes: true});
dirEntries.then((values)=>{
  for (let value of values) {
    if (value.isFile()) {
      const filePath = path.join(__dirname, 'styles',value.name);
      const ext = path.extname(filePath);
      if (ext === '.css') {
          const streamInput = fs.createReadStream(filePath);
            streamInput.on('data', (data) => {
                fs.appendFile(path.join(__dirname, 'project-dist','style.css'), data, (err) => {
                    if(err) throw err;
                });
            });
      }
    }
  }
})
async function createIndex() {
  try {
    const stream = fs.createWriteStream(path.resolve(path.join(__dirname, 'project-dist'), 'index.html'));
    let template = await fs.promises.readFile(path.resolve(__dirname, 'template.html'), 'utf-8');
    const tags = template.match(/{{.+}}/g);
    for (let tag of tags) {
      const file = tag.match(/(?<={{).+?(?=}})/g).toString() + '.html';
      await fs.promises.readFile(path.join(path.join(__dirname, 'components'), file), 'utf-8').then(data => {
        template = template.replace(tag, data);
      });
    }
    stream.write(template);
  } catch (err) {
    console.log(err.message);
  }
}
createIndex();
function unlinkDir(src) {
  let values = fsPromises.readdir(src, { withFileTypes: true });
  values.then ((entries)=>{
    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        if (entry.isDirectory()) {
          fsPromises.readdir(srcPath).then(files => {
              if (files.length === 0) {
                fsPromises.rm(srcPath, { recursive: true});
              }
          });
          unlinkDir(srcPath);
        } else {
          unlinkFile(srcPath);
        }
    }
  })
}

function copyDir(src, dest) {
  fsPromises.mkdir(dest, { recursive: true });
  let values = fsPromises.readdir(src, { withFileTypes: true });
  values.then ((entries)=>{
    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);
        entry.isDirectory() ?
            copyDir(srcPath, destPath) :
            fsPromises.copyFile(srcPath, destPath);
    }
  })
}
fs.access(path.join(__dirname,'project-dist','assets'), function(err) {
  if (err && err.code === 'ENOENT') {
    copyDir(path.join(__dirname,'assets'), path.join(__dirname,'project-dist','assets'));
  } else {
    unlinkDir(path.join(__dirname,'project-dist','assets'));
    copyDir(path.join(__dirname,'assets'), path.join(__dirname,'project-dist','assets'));
  }
});

