// const {ipcMain, BrowserWindow} = require('electron');
// const {download} = require("electron-dl");

// function downloadAlternative(info) {
//   info.properties.onProgress = status => mainWindow.webContents.send("download-alternative-progress", status);
//   // info.properties.onCompleted = file => mainWindow.webContents.send("download-alternative-completed", file);
//   // info.properties.onProgress = status => console.log(status);
//   download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
//       .then(dl => mainWindow.webContents.send("download-alternative-complete", dl.getSavePath()));
// }

// ipcMain.on("eu-download-alternative", (event, info) => {
//   downloadAlternative(info);
// });

// downloadAlternative({
//   url: "https://github.com/natancabral/pdfkit-table/raw/main/example/document.pdf",
//   properties: {
//     openFolderWhenDone: true,
//     saveAs: true, 
//     // directory: "./pdf" // "c:/Folder" If not defined go to /Download path
//   }
// });

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
//           win.webContents.send('download-update-started', {
//             fileName: item.getFilename(),
//             updateIdentificator,
//           });
//         },
//         onProgress: currentProgress => {
//           win.webContents.send('download-update-progress', {
//             currentProgress,
//             updateIdentificator,
//           });
//         },
//       });
//       win.webContents.send('download-update-finished', {
//         updateIdentificator,
//       });
//     }
//   },
// );

// npm install electron-dl
// https://stackoverflow.com/questions/46102851/electron-download-a-file-to-a-specific-location#48231664
// https://ourcodeworld.com/articles/read/228/how-to-download-a-webfile-with-electron-save-it-and-show-download-progress
// https://github.com/sindresorhus/electron-dl
// https://developpaper.com/electron-download-exe-file-update/
