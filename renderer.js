const { ipcRenderer } = require('electron');

function setStartID() {
  const id = document.getElementById('startIDInput').value.trim().toUpperCase();
  ipcRenderer.send('set-start-id', id);
}

ipcRenderer.on('start-id-result', (event, message) => {
  document.getElementById('msg').innerText = message;
});
