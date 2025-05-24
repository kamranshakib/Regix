const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const expressApp = require('./app');

let mainWindow;
const port = 2004;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(`http://localhost:${port}/form`);

  mainWindow.webContents.on('did-finish-load', () => {
    // فقط بعد از لود کامل صفحه
    mainWindow.webContents.printToPDF({ printBackground: true }).then(data => {
      const pdfPath = path.join(__dirname, 'output.pdf');
      fs.writeFile(pdfPath, data, (err) => {
        if (err) return console.log('PDF Failed:', err);
        console.log('PDF Saved to:', pdfPath);
      });
    }).catch(error => {
      console.log('PDF Generation Error:', error);
    });
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
  expressApp.listen(port, () => {
    console.log(`Express app running on http://localhost:${port}`);
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
