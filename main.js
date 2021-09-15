const { dialog, app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');

// process.env.GH_TOKEN = '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';

function war(str){
	dialog.showMessageBox({
		type: 'info',
		title: 'Warning',
		message: str,
	});
}

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('./index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    war('Version: ' + app.getVersion());

	if (isDev) {
		war('Running in development');
	} else {
    autoUpdater.checkForUpdates();
    autoUpdater.checkForUpdatesAndNotify();
		war('Running in production');
	}

  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

autoUpdater.on('update-available', () => {
  war('--update_available');
  //mainWindow.webContents.send('update_available');
});

ipcMain.on('restart_app', () => {
  war('--restart_app');
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error' , (error) => {

  let m = error.message;
  m = m.replace('release/','r/');
  m = m.replace('download/','d/');

  if(m === 'No published versions on GitHub') {
    dialog.showErrorBox('Error', 'Sem versões publicadas');
  }
  else if(isDev){
  	dialog.showErrorBox('Error', m);
  } else {
  	dialog.showErrorBox('Error', m);
  }

})

autoUpdater.on('update-downloaded', (info) => {

  const message = {
    type: 'info',
    buttons: ['Restart', 'Update'],
    title: `Update`,
    detail: `A new version has been downloaded. Restart to apply the updates.`
  }

  dialog.showMessageBox(message, (res) => {
    if(res === 0) {
      autoUpdater.quitAndInstall();
    }
  })
})

autoUpdater.on('download-progress', function (progressObj) {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    war(log_message);
});


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