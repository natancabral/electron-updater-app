// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  const { ipcRenderer } = require('electron');

  const notification  = document.getElementById('eu-notification');
  const message       = document.getElementById('eu-message');
  const version       = document.getElementById('version');
  const restartButton = document.getElementById('restart-button');
  const closeButton   = document.getElementById('close-button');

  ipcRenderer.send('eu-app-version');
  ipcRenderer.on('eu-app-version', (event, arg) => {
    version.innerText = 'Version ' + arg.version;
    ipcRenderer.removeAllListeners('app-version');
  });

  ipcRenderer.on('eu-update-available', () => {
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
    ipcRenderer.removeAllListeners('eu-update-available');
  });

  ipcRenderer.on('eu-update-downloaded', () => {
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
    ipcRenderer.removeAllListeners('eu-update-downloaded');
  });

  function euCloseNotification() {
    notification.classList.add('hidden');
  }

  function euRestartApp() {
    ipcRenderer.send('eu-restart-app');
  }

  closeButton.addEventListener('click', euCloseNotification);
  restartButton.addEventListener('click', euRestartApp);

  // Download Start ---------------------------------------------------------------------------

  // Send
  ipcRenderer.send("eu-download-alternative", {
    url: "https://github.com/natancabral/pdfkit-table/raw/main/example/document.pdf",
    properties: {
      directory: "./pdf" // "c:/Folder"
    }
  });

  ipcRenderer.on("eu-download-alternative-complete", (event, file) => {
    console.log(file); // Full file path
  });
  
  ipcRenderer.on("eu-download-alternative-progress", (event, progress) => {
    const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
    const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
    console.log(progressInPercentages, cleanProgressInPercentages); // Progress in fraction, between 0 and 1
  });
  
  // Download End -----------------------------------------------------------------------------

});