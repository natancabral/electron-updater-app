const fs = require("fs");
const package = require('./package.json');
const dirPath = './dist';

// rename file to release
fs.readdirSync(dirPath).forEach(function(file) {
  if (fs.statSync(`${dirPath}/${file}`).isFile()) {
    if(file.indexOf(package.build.productName) > -1){
      const renamed = file.replace(
        `${package.build.productName}-${package.version}`,
        `${package.name}-Setup-${package.version}`,
        );
      // remove old file
      try {
        fs.unlinkSync(`${dirPath}/${renamed}`);        
      } catch (error) {}
      // rename new file
      fs.renameSync(`${dirPath}/${file}`, `${dirPath}/${renamed}`);
    }
  }
});