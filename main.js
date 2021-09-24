const { dialog, app, BrowserWindow, ipcMain, webContents } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const isDev = require('electron-is-dev');
const path = require('path');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

function exitAll() {
  mainWindow == null;
  app.quit();
  app.exit();
}

function war(str) {
	dialog.showMessageBox({
		type: 'info',
		title: 'Warning',
		message: str,
	});
}

// Start App

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nativeWindowOpen: false,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    // war('Version: ' + app.getVersion());
    if (isDev) {
      war('Running in development');
    } else {
      // war('Running in production');
      autoUpdater.checkForUpdates();
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
}

// app.on('ready', () => {
//   createWindow();
//   console.log('--1--');
// });

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch( err => {
  console.log( err );
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    exitAll();
  }
});

// End App

// autoUpdater
autoUpdater.on('update-available', () => {
  // war('Update available');
  mainWindow.webContents.send('eu-update-available');
});

// autoUpdater
autoUpdater.on('error' , (error) => {
  let m = error.message;
  m = m.replace('release/','r/');
  m = m.replace('download/','d/');
  if(m === 'No published versions on GitHub') {
    dialog.showErrorBox('Error', 'Sem versões publicadas');
  } else if(isDev){
  	dialog.showErrorBox('Error(Dev)', m);
  } else {
  	dialog.showErrorBox('Error', m);
  }
});

// autoUpdater
autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('eu-update-downloaded');
  const message = {
    type: 'info',
    buttons: ['Restart', 'Update', 'Cancel'],
    title: `Update`,
    detail: `A new version has been downloaded. Restart to apply the updates.`
  }
  dialog.showMessageBox(message, (res) => {
    if(res === 0) {
      autoUpdater.quitAndInstall();
      // app.relaunch();
      exitAll();
    }
  })
})

// autoUpdater
autoUpdater.on('download-progress', function (progressObj) {
  let messege = "Download speed: " + progressObj.bytesPerSecond;
  messege = messege + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
  messege = messege + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  mainWindow.webContents.send('eu-download-progress', messege);
});

// End AutoUpdater

// Start ipcMain

ipcMain.on('eu-app-version', (event) => {
  event.sender.send('eu-app-version', { version: app.getVersion() });
});

ipcMain.on('eu-restart-app', () => {
  autoUpdater.quitAndInstall();
  // app.relaunch();
  exitAll();
});

// End ipcMain

// will-finish-launching: Triggered when the application completes the basic startup
// web-contents-created:webContents is created
// browser-window-created:BrowserWindow is created
// ready: Triggered when Electron completes initialization
// remote-require: Called when remote is introduced
// before-quit: Triggered before the application starts to close the window
// will-quit: Emitted when all windows have been closed and the application will exit
// quit: Issued when the application exits
// window-all-closed: Triggered when all windows are closed
// browser-window-focus: Emitted when browserWindow gains focus
// browser-window-blur: Emitted when the browserWindow loses focus
// ready-to-show: Triggered when the page has been rendered (but not yet displayed) and the window can be displayed
// move: Window move
// resize: Triggered after the window is resized
// close: Triggered when the window is about to be closed. It fires before the beforeunload and unload events of the DOM.
// blur: Lost focus, same app
// focus: Get focus, same app
// maximize: Triggered when the window is maximized
// unmaximize: Triggered when the window is maximized and exited
// minimize: Triggered when the window is minimized
// restore: Triggered when the window is minimized and restored


// realease
// https://github.com/johndyer24/electron-auto-update-example/releases
// https://medium.com/@johndyer24/creating-and-deploying-an-auto-updating-electron-app-for-mac-and-windows-using-electron-builder-6a3982c0cee6
// my release
// https://github.com/natancabral/electron-updater-app/releases/tag/v1.0.1

// npm install electron-dl
// https://stackoverflow.com/questions/46102851/electron-download-a-file-to-a-specific-location#48231664
// https://ourcodeworld.com/articles/read/228/how-to-download-a-webfile-with-electron-save-it-and-show-download-progress
// https://github.com/sindresorhus/electron-dl
// https://developpaper.com/electron-download-exe-file-update/


// Start Download Alternative
const {download} = require("electron-dl");

ipcMain.on("eu-download-alternative", (event, info) => {
  info.properties.onProgress = status => mainWindow.webContents.send("eu-download-alternative-progress", status);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => mainWindow.webContents.send("eu-download-alternative-complete", dl.getSavePath()));
});

// End Download Alternative