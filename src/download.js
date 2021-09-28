const {BrowserWindow, ipcRenderer} = require('electron');
const {latestStableVersion} =  require("latest-stable-version");
const down = require("electron-dl").download;
const messages = require('./messages-en');
const {release, version} = require('../package.json');
const os = require('os');

var tryLatestVersion = true;

function content() {
  // let mainWindow = BrowserWindow.getFocusedWindow();
  let mainWindow = BrowserWindow.getAllWindows()[0];
  return mainWindow.webContents || ipcRenderer;
}

// {
//   filename: 'file.zip',
//   path: '/path/file.zip',
//   fileSize: 503320,
//   mimeType: 'application/zip',
//   url: 'https://example.com/file.zip'
// }

function execApp(data) {
  try {
    var exec = require('child_process').execFile;
    var fun = function() {
      // console.log("fun() start");
      exec(data.path, function(err, data) {
        // console.log(err);
        // console.log(data.toString());
      });
    }
    fun();
  } catch (error) {
    // error
    content().send('message', { type: 'download-alternative-error-exec', message: messages.download_error_exec, hide: false });
  }
}

function getRelease() {
  
  if(!tryLatestVersion) return;

  const { owner, repo, template} = release;

  return new Promise((resolve, reject) => {
    latestStableVersion({
      owner: owner,
      repo: repo,
    }).then( v => {

      if(Number(v) <= Number(version) || v === version) {
        reject({ error: messages.update_not_avaliable, updated: true });
        return;
      }
      
      content().send('message', { type: 'download-alternative-canceled', message: messages.download_canceled });
      return;

      let extension = '';
      let url = template;
    
      switch(os.platform()) {
        case 'darwin': extension = 'dmg'; break;
        case 'win32':  extension = 'exe'; break;
        case 'win64':  extension = 'exe'; break;
        case 'linux':  extension = 'deb'; break;
      }

      url = url.replace(/\[owner\]/g, owner);
      url = url.replace(/\[repo\]/g, repo);
      url = url.replace(/\[extension\]/g, extension);
      url = url.replace(/\[version\]/g, v);

      if(!owner || !repo || !extension || !v) {
        reject({ error: messages.download_error_url, updated: false });
        return;
      }

      resolve(url);

    }).catch( error => {

      tryLatestVersion = true;
      resolve({ error: messages.download_file_corrupted, updated: false });

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
    openFolderWhenDone: true,
    saveAs: false, 
    // directory: "./pdf" // "c:/Folder" If not defined go to /Download path
  };

  if(properties) {
    info = {...info,...properties};
  }

  info.onProgress = downloadProgress;
  info.onCompleted = downloadComplete;
  info.onCancel = onCancel;

  return down(BrowserWindow.getAllWindows()[0], url, info)
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
    
    content().send('message',{ type: 'download-alternative-found', message: messages.download_found });
    content().send('download-alternative-found');
    
    download(url).then( dl => {
      // run app
      execApp(dl);
    }).catch( data => {
      content().send('message',{ type: 'download-alternative-corrupted', message: data.error || messages.download_bad_server_connection, hide: true });
    });
    
  }).catch( error => {
    content().send('message',{ type: 'download-alternative-error', message: messages.download_error });
  });

}

module.exports = {
  download,
  checkForUpdates,
  checkForUpdatesAndDownload,
}

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