const { dialog, ipcRenderer } = require('electron');
const { autoUpdater } = require('electron-updater');
// const os = require('os');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const {version} = require('../package.json');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

let initialized = false;
// let updateFeed = '';

// Nuts Server
// https://github.com/GitbookIO/nuts
// const nutsURL = 'https://electron-autoupdater-starter-server.now.sh';
// const platform = `${os.platform()}_${os.arch()}`;

// if (os.platform() === 'darwin') {
//   updateFeed = `${nutsURL}/update/${platform}/${version}`
// } else if (os.platform() === 'win32') {
//   updateFeed = `${nutsURL}/update/win32/${version}`
// } else {
//   updateFeed = `${nutsURL}/update/${platform}/${version}`
// }

/* 
// on
message
update-error
update-checking
update-available
update-not-available
update-downloaded
update-download-progress
// send
restart-app
*/

function init (mainWindow){

  if (initialized || isDev) {
    message(`Running in development ${version}`);
    return
  };

  initialized = true;
  // autoUpdater.setFeedURL(updateFeed);

  autoUpdater.on('error' , (error) => {
    let { message } = error;
    // message filter    
    if(message === 'No published versions on GitHub') {
      message = 'Sem versões publicadas';
    } else if(String(message).includes('Cannot download')){
      // const url = String(message).split('"');
      message = `Cannot download`;
    } else if(String(message).includes('ENOENT: no such file or directory, open') && String(message).includes('.yml')){
      message = `YML file  not found (local)`;
    } else if(String(message).includes('.yml in the latest release artifacts')){
      message = `YML file  not found (http)`;
    } else if(isDev){
      message = `Error(Dev): ${message}`;
    } else {
      message = `${message}`;
    }
    // send to window event
    // mainWindow.webContents.send('update-error', message);
    mainWindow.webContents.send('message', { type: 'update-error', message: `😱 Error: ${message}` });
  });

  autoUpdater.once('checking-for-update', (ev, err) => {
    // send to window event
    // mainWindow.webContents.send('update-checking');
    mainWindow.webContents.send('message', { type: 'update-checking', message: '🔎 Checking for updates' });
  });

  autoUpdater.once('update-available', () => {
    // send to window event
    // mainWindow.webContents.send('update-available');
    mainWindow.webContents.send('message', { type: 'update-available', message: '🎉 Update available. Downloading ⌛️' }); // , hide: false
  });

  autoUpdater.once('update-not-available', (ev, err) => {
    // send to window event
    // mainWindow.webContents.send('update-not-available');
    mainWindow.webContents.send('message', { type: 'update-not-available', message: '👎 Update not available' });
  });

  autoUpdater.on('update-downloaded', (info) => {
    // send to window event
    // mainWindow.webContents.send('update-downloaded');
    mainWindow.webContents.send('message', { type: 'update-downloaded', message: '👍 Downloaded' });
    // const message = {
    //   type: 'info',
    //   buttons: ['Restart', 'Update', 'Cancel'],
    //   title: `Update`,
    //   message: 'Do you want to do this?',
    //   detail: `A new version has been downloaded. Restart to apply the updates.`
    // }
    // dialog.showMessageBox(message, (res) => {
    //   if(res === 0) {
    //     ipcRenderer.send('restart-app');
    //   }
    // })
  })

  // autoUpdater
  autoUpdater.on('download-progress', function (data) {
    let message = '';
    message += `Speed ${data.bytesPerSecond} - `;
    message += `Downloaded ${parseInt(data.percent)}% `;
    // message += `(${data.transferred} / ${data.total}) `;
    // mainWindow.webContents.send('update-download-progress', message);
    mainWindow.webContents.send('message', { type: 'update-download-progress', message: message });
  });

}

function checkForUpdates () {
  try {
    autoUpdater.checkForUpdates();
    autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {} 
}

function quitAndInstall () {
  autoUpdater.quitAndInstall();
}

function message (message) {
	dialog.showMessageBox({
		type: 'info',
		title: 'Message',
		message: message,
	});
}

module.exports = {
  init,
  checkForUpdates,
  quitAndInstall,
  message
}