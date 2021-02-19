let inputDir = "\\input"
const mergeDirs = require('merge-dirs').default;
const unzipper = require('unzipper');
const fs = require('fs');
const { join } = require('path');
const { exit } = require('process');

let outputDir = process.argv[2];

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

const dirs = root => fs.readdirSync(root).filter(f => fs.statSync(join(root,f)));

let folders = dirs(__dirname + inputDir);

if(folders.length === 0){
    console.error('no folders found');
    exit(0);
}

let rootdir = __dirname + inputDir + '\\'

Promise.all(folders.map((folder) => {
    return new Promise((resolve)=> {
        unzipFolder(rootdir + folder, folder).then(() => {
            resolve();
        });
    });
  })
).then(() =>{
     console.log("Extraction of folders complete!");
     mergeFolders();
})

async function unzipFolder(path, folder){
    console.log("Unzipping folder " + path + ".......");
    const directory = await unzipper.Open.file(path);
    await directory.extract({path: rootdir + folder.substring(0, folder.length - 4)});
    return 'File Unzipped';
}

function mergeFolders(){
    folders.forEach((folder) => {
        let path = rootdir + folder.substring(0, folder.length - 4);
        console.log("Merging folder " + path + "....");
        mergeDirs(path, outputDir, 'overwrite');
        console.log("Merged folder " + path) 
    });

    console.log("Cleaning up....");
    dirs(__dirname + inputDir).forEach((dir) => {
        fs.rmdir(dir, { recursive: true }).then(() => console.log('directory removed!'));
    });
}
