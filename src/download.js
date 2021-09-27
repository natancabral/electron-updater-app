const {BrowserWindow, ipcRenderer} = require('electron');
const down = require("electron-dl").download;
const {latestStableVersion} =  require("latest-stable-version");
const messages = require('./locale/messages-en');
const package = require('./../package.json');
const os = require('os');

var latestVersion = 0;
var tryLatestVersion = true;

function content() {
  // let mainWindow = BrowserWindow.getFocusedWindow();
  let mainWindow = BrowserWindow.getAllWindows()[0];
  return mainWindow.webContents || ipcRenderer;
}

function getLatestRelease () {
  const { owner, repo } = package.build.publish[0];
  if(tryLatestVersion){
    tryLatestVersion = false;
    latestStableVersion({
      owner: owner,
      repo: repo,
    }).then( version => {
      latestVersion = version;  
    }).catch( err => tryLatestVersion = true);  
  }
};

function getURLRelease() {

  if(!latestVersion) getLatestRelease();

  const { owner, repo } = package.build.publish[0];  

  let ext = '';

  switch(os.platform()) {
    case 'darwin': ext = 'dmg';
    case 'win32': ext = 'exe';
    case 'win64': ext = 'exe';
    case 'linux': ext = 'deb';
  }

  let url = `https://github.com/${owner}/${repo}/releases/download/v${latestVersion}/${repo}-Setup-${latestVersion}.${ext}`;

  content().send('message',{type:'aq', message:url});
  return url;
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

function checkForUpdates(callback) {

  if(!latestVersion){
    getLatestRelease()
    setTimeout(checkForUpdatesAndDownload,3000);
    return;
  }

  const url = getURLRelease();
  if(url){
    // message
    content().send('message',{ type: 'download-alternative-found', message: messages.download_alternative_found});  
    // channel found
    content().send('download-alternative-found');
    if(callback) callback();
  }
}

function checkForUpdatesAndDownload() {

  if(!latestVersion){
    getLatestRelease()
    setTimeout(checkForUpdatesAndDownload,3000);
    return;
  }

  const url = getURLRelease();
  if(url){
    content().send('message',{ type: 'download-alternative-found', message: url});  
    download(url);
  }
}

module.exports = {
  download,
  checkForUpdates,
  checkForUpdatesAndDownload
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