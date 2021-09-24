const fs = require("fs");
const path = require("path");

exports.default = async (context) => {
  console.log("after pack hook - rename files");
};

/*
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

exports.default = async context => {

  let data = {
    provider: 'spaces',
    name: 'demoapp',
    region: 'nyc3',
    path: '/test/'
  };

  switch (process.platform) {
    case "win32": // win
      data.updaterCacheDirName = 'demo-app-updater';
      data.publisherName = ['Company Name LLC'];
      fs.writeFileSync(
        path.join(__dirname, 'dist','win-unpacked','resources','app-update.yml'), yaml.safeDump(data), 'utf8'
      );
      break;
    default: // unix
      data.updaterCacheDirName = 'demoapp-updater';
      fs.writeFileSync(
        path.join(__dirname, 'dist','mac','Demo App.app','Contents','Resources','app-update.yml'), yaml.safeDump(data), 'utf8'
      );
      break;
  }

  fs.writeFileSync(
      path.join(__dirname, 'dev-app-update.yml')
      , yaml.safeDump(data)
      , 'utf8'
  )
}
*/
