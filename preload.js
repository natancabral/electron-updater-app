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

  const version = document.getElementById('version');
  const notification = document.getElementById('notification');
  const message = document.getElementById('message');
  const restartButton = document.getElementById('restart-button');

  ipcRenderer.send('app_version');
  ipcRenderer.on('app_version', (event, arg) => {
    version.innerText = 'Version ' + arg.version;
    ipcRenderer.removeAllListeners('app_version');
  });

  ipcRenderer.on('update_available', () => {
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
    ipcRenderer.removeAllListeners('update_available');
  });

  ipcRenderer.on('update_downloaded', () => {
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
    ipcRenderer.removeAllListeners('update_downloaded');
  });

  function closeNotification() {
    notification.classList.add('hidden');
  }

  function restartApp() {
    ipcRenderer.send('restart_app');
  }

});