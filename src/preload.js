// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

  const { ipcRenderer } = require('electron');

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  const notification        = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const progress            = document.getElementById('notification-progress');
  const restartButton       = document.getElementById('notification-restart-button');
  const cancelButton        = document.getElementById('notification-cancel-button');
  const version             = document.getElementById('version');
  const containerMessages   = document.getElementById('container-messages');
  
  /*
  on 
  version-app
  update-error
  update-checking
  update-available
  update-not-available
  update-downloaded
  update-download-progress
  send
  version-app
  */

  // Message ----------------------------------------------

  let lastMsgId = 0;
  function showMessage(data) {

    let {type, message, hide, replaceAll} = data;

    hide = (hide === undefined) ? true : hide;
    replaceAll = (replaceAll === undefined) ? false : replaceAll;

    if(type === 'update-downloaded'){
      restartButton.classList.remove('hidden');
    }

    notification.classList.remove('hidden');
    notificationMessage.innerText = message;

    const msgId = lastMsgId++ + 1
    const msgTemplate = `<div id="${msgId}" class="alert alert-info alert-info-message animated fadeIn">${message}</div>`
  
    if (replaceAll) {
      containerMessages.innerHTML = msgTemplate
    } else {
      containerMessages.insertAdjacentHTML('afterbegin', msgTemplate)
    }
  
    if (hide) {
      setTimeout(() => {
        const msgEl = document.getElementById(msgId)
        msgEl.classList.remove('fadeIn')
        msgEl.classList.add('fadeOut')
      }, 4000);
    }
  }

  ipcRenderer.on('console', (event, consoleMsg) => {
    console.log(consoleMsg);
  })
  
  ipcRenderer.on('message', (event, data) => {
    showMessage(data);
  })

  // Message ----------------------------------------------

  // ipcRenderer.on('update-error', (event, error) => {
  //   message.innerHTML = `${error}`;
  //   notification.classList.remove('hidden');
  //   console.log(error);
  //   // ipcRenderer.removeAllListeners('update-error');
  // });

  // ipcRenderer.on('update-checking', () => {
  //   message.innerText = `Checking update...`;
  //   notification.classList.remove('hidden');
  //   // ipcRenderer.removeAllListeners('update-checking');
  // });

  // ipcRenderer.on('update-available', () => {
  //   message.innerText = 'A new update is available. Downloading now...';
  //   notification.classList.remove('hidden');
  //   // ipcRenderer.removeAllListeners('update-available');
  // });

  // ipcRenderer.on('update-not-available', () => {
  //   message.innerText = 'Not update available.';
  //   notification.classList.add('hidden');
  //   // ipcRenderer.removeAllListeners('update-available');
  // });

  // ipcRenderer.on('update-downloaded', () => {
  //   message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
  //   notification.classList.remove('hidden');
  //   restartButton.classList.remove('hidden');
  //   // ipcRenderer.removeAllListeners('update-downloaded');
  // });

  // ipcRenderer.on('update-download-progress', (event, data) => {
  //   message.innerText = data;
  //   notification.classList.remove('hidden');
  //   restartButton.classList.remove('hidden');
  //   // ipcRenderer.removeAllListeners('update-download-progress');
  // });

  ipcRenderer.send('version-app');
  ipcRenderer.on('version-app', (event, arg) => {
    version.innerText = `Version ${arg.version}`;
    ipcRenderer.removeAllListeners('version-app');
  });

  function cancelNotification() {
    notification.classList.add('hidden');
  }

  function restartApp() {
    ipcRenderer.send('restart-app');
  }

  cancelButton.addEventListener('click', cancelNotification);
  restartButton.addEventListener('click', restartApp);

  // Download Alternative Start ---------------------------------------------------------------------------

  // Send
  // ipcRenderer.send("download-alternative", {
  //   // url: "https://github.com/natancabral/pdfkit-table/raw/main/example/document.pdf",
  //   url: 'https://github.com/natancabral/electron-updater-app/releases/download/v1.0.2/electron-updater-app-Setup-1.0.2.exe',
  //   properties: {
  //     openFolderWhenDone: true,
  //     saveAs: true, 
  //     // directory: "./pdf" // "c:/Folder" If not defined go to /Download path
  //   }
  // });

  ipcRenderer.on("download-alternative-complete", (event, file) => {
    console.log(file); // Full file path
    progress.innerHTML = `<a href="${file}" target="_blank"> Open file </a>`;
  });
  
  ipcRenderer.on("download-alternative-progress", (event, progress) => {
    const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
    const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
    console.log(progressInPercentages, cleanProgressInPercentages); // Progress in fraction, between 0 and 1
    progress.innerHTML = `${progressInPercentages} ${cleanProgressInPercentages}`;
  });
  
  // Download Alternative End -----------------------------------------------------------------------------

});