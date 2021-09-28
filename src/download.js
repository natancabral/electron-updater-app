const {BrowserWindow, ipcRenderer} = require('electron');
const {latestStableVersion} =  require("latest-stable-version");
const down = require("electron-dl").download;
const messages = require('./messages-en');
const {release} = require('./../package.json');
const os = require('os');

var tryLatestVersion = true;

function content() {
  // let mainWindow = BrowserWindow.getFocusedWindow();
  let mainWindow = BrowserWindow.getAllWindows()[0];
  return mainWindow.webContents || ipcRenderer;
}

function getRelease() {
  
  if(!tryLatestVersion) return;

  const { owner, repo, template} = release;

  return new Promise((resolve, reject) => {
    latestStableVersion({
      owner: owner,
      repo: repo,
    }).then( version => {
      
      let extension = '';
      let url = template;
    
      switch(os.platform()) {
        case 'darwin': extension = 'dmg';
        case 'win32':  extension = 'exe';
        case 'win64':  extension = 'exe';
        case 'linux':  extension = 'deb';
      }

      url = url.replace(/\[owner\]/g, owner);
      url = url.replace(/\[repo\]/g, repo);
      url = url.replace(/\[extension\]/g, extension);
      url = url.replace(/\[version\]/g, version);

      if(!owner || !repo || !extension || !version) {
        reject(url);
        return;
      }

      resolve(url);

    }).catch( error => {

      tryLatestVersion = true;
      resolve(error);

    });
  });
}

function downloadProgress(progress) {
  content().send('message', { type: 'download-progress', message: `Completed: ${progress.percent * 100 >> 0}%` });
}

function downloadComplete(file) {
  let message;
  let type;
  if('errorTitle' in file || 'errorMessage' in file) { // file.hasOwnProprety(errorTitle)
    type = 'download-error';
    message = messages.download_error;
  } else {
    type = 'download-completed';
    message = messages.download_complete;
  }
  content().send('message', { type, message });
}

function onCancel(file) {
  content().send('message', { type: 'download-alternative-canceled', message: messages.download_canceled });
}

/**
 * 
 * @param {String} url 
 * @param {Object} properties 
 * properties: {
 *   openFolderWhenDone: true,
 *   saveAs: true, 
 *   // directory: "./pdf" // "c:/Folder" If not defined go to /Download path
 * },
 */
function download(url, properties) {

  let info = {
    url: url,
    properties: {
      openFolderWhenDone: true,
      saveAs: true, 
      // directory: "./pdf" // "c:/Folder" If not defined go to /Download path
    },
  };

  if(properties) {
    info = {...info, properties: {...info.properties, ...properties}};
  }

  info.properties.onProgress = downloadProgress;
  info.properties.onCompleted = downloadComplete;
  info.properties.onCancel = onCancel;

  return down(BrowserWindow.getFocusedWindow(), info.url, info.properties)
  // .then( dl => {
  //   console.log('complete:', dl); // Full file path
  //   console.log('complete:file:', dl.getSavePath());
  // });
}

function checkForUpdates() {

  getRelease().then( () => {
    content().send('message',{ type: 'download-alternative-found', message: messages.download_found });
    content().send('download-alternative-found');
  }).catch( error => {
    content().send('message',{ type: 'download-alternative-error', message: messages.download_error});
  });

}

function checkForUpdatesAndDownload() {

  getRelease().then( url => {
    content().send('message',{ type: 'url', message: url });
    download(url);
  }).catch( error => {
    content().send('message',{ type: 'download-alternative-error', message: messages.download_error });
  });

}

module.exports = {
  download,
  checkForUpdates,
  checkForUpdatesAndDownload,
}

// End Download Alternative

// const downloadItems = [];
// ipcMain.on(
//   'download-update',
//   async (event, { url, downloadPath, updateIdentificator }) => {
//     if (win) {
//       await download(win, url, {
//         directory: downloadPath,
//         onStarted: item => {
//           downloadItems[updateIdentificator] = item;
//           win.content().send('download-update-started', {
//             fileName: item.getFilename(),
//             updateIdentificator,
//           });
//         },
//         onProgress: currentProgress => {
//           win.content().send('download-update-progress', {
//             currentProgress,
//             updateIdentificator,
//           });
//         },
//       });
//       win.content().send('download-update-finished', {
//         updateIdentificator,
//       });
//     }
//   },
// );

// npm install electron-dl
// https://stackoverflow.com/questions/46102851/electron-download-a-file-to-a-specific-location#48231664
// https://ourcodeworld.com/articles/read/228/how-to-download-a-webfile-with-electron-save-it-and-show-download-progress
// https://github.com/sindresorhus/electron-dl