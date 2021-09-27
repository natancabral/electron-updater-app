const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('path');
const updater = require('./updater');

let mainWindow;

// Init

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

  mainWindow.loadFile('./src/index.html');
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    updater.init(mainWindow);
    updater.checkForUpdates(mainWindow);
  });
  
}

// Ready

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch( err => console.log(err) );

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    exitAll();
  }
});

function exitAll() {
  mainWindow == null;
  app.quit();
  app.exit();
}

// ipcMain

ipcMain.on('version-app', (event) => {
  event.sender.send('version-app', { version: app.getVersion() });
});

ipcMain.on('restart-app', () => {
  updater.quitAndInstall();
  // app.relaunch();
  exitAll();
});

// Download Alternative

const {download} = require("electron-dl");

function downloadAlternative(info) {
  info.properties.onProgress = status => mainWindow.webContents.send("eu-download-alternative-progress", status);
  info.properties.onCompleted = file => mainWindow.webContents.send("eu-download-alternative-completed", file);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => mainWindow.webContents.send("eu-download-alternative-complete", dl.getSavePath()));
}

ipcMain.on("eu-download-alternative", (event, info) => {
  downloadAlternative(info);
});

// downloadAlternative({
//   url: "https://github.com/natancabral/pdfkit-table/raw/main/example/document.pdf",
//   properties: {
//     openFolderWhenDone: true,
//     saveAs: true, 
//     // directory: "./pdf" // "c:/Folder" If not defined go to /Download path
//   }
// });

// End Download Alternative

// BrowserWindow Trigger
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
