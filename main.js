const { dialog, app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const path = require('path');

// process.env.GH_TOKEN = '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';

function war(str){
	dialog.showMessageBox({
		type: 'info',
		title: 'Warning',
		message: str,
	});
}

if (isDev) {
  autoUpdater.updateConfigPath = path.join(__dirname, 'app-update.yml');
}

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
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
      autoUpdater.checkForUpdates();
      autoUpdater.checkForUpdatesAndNotify();
      // war('Running in production');
    }
  });
}

app.on('ready', () => {
  // createWindow();
  console.log('--1--');
});

app.whenReady().then(() => {
  createWindow();
  console.log('--2--');
  app.on('activate', function () {
    console.log('--3--');
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log('--4--');
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

autoUpdater.on('update-available', () => {
  war('Update available');
  mainWindow.webContents.send('update_available');
});

ipcMain.on('restart_app', () => {
  // war('--restart_app');
  autoUpdater.quitAndInstall();
  app.relaunch();
  app.quit(0);
  mainWindow.quit();
});

autoUpdater.on('error' , (error) => {
  let m = error.message;
  m = m.replace('release/','r/');
  m = m.replace('download/','d/');
  if(m === 'No published versions on GitHub') {
    dialog.showErrorBox('Error', 'Sem versões publicadas');
  } else if(isDev){
  	dialog.showErrorBox('Error(1)', m);
  } else {
  	// dialog.showErrorBox('Error(2)', m);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('update_downloaded');
  const message = {
    type: 'info',
    buttons: ['Restart', 'Update'],
    title: `Update`,
    detail: `A new version has been downloaded. Restart to apply the updates.`
  }
  dialog.showMessageBox(message, (res) => {

    autoUpdater.quitAndInstall();
    app.relaunch();
    app.quit(0);
    mainWindow.quit();

    if(res === 0) {
      autoUpdater.quitAndInstall();
      app.relaunch();
      app.quit(0);
      mainWindow.quit();
    }
  })
})

autoUpdater.on('download-progress', function (progressObj) {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  war(log_message);
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


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


// Download Start ---------------------------------------------------------------------------
const {download} = require("electron-dl");

ipcMain.on("download", (event, info) => {
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
    .then(dl => mainWindow.webContents.send("download complete", dl.getSavePath()));
});

ipcMain.on("download", (event, info) => {
  info.properties.onProgress = status => mainWindow.webContents.send("download progress", status);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => mainWindow.webContents.send("download complete", dl.getSavePath()));
});
// Download End -----------------------------------------------------------------------------
