const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// --- electron-updater-app ---
const updater = require('./updater');
// --- electron-updater-app ---

let mainWindow;

// Init
function createWindow() {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // --- electron-updater-app ---
      preload: path.join(__dirname, 'preload.js'),
      // --- electron-updater-app ---
      nodeIntegration: true,
      nativeWindowOpen: false,
    },
  });

  mainWindow.loadFile('./src/index.html');
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // --- electron-updater-app ---
  mainWindow.once('ready-to-show', () => {
    updater.init(); // auto update
    updater.checkForUpdates();
  });
  // --- electron-updater-app ---
  
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
  mainWindow = null;
  app.quit();
  app.exit();
}

ipcMain.on('version-app', (event) => {
  console.log(app.getVersion());
  event.sender.send('version-app', { version: app.getVersion() });
});

// --- electron-updater-app ---
ipcMain.on('restart-app', () => {
  updater.quitAndInstall();
  // app.relaunch();
  exitAll();
});
// --- electron-updater-app ---

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