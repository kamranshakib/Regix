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
    icon: path.join(__dirname, 'omid.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // اگر نیاز داری
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(`http://localhost:${port}/form`);

  mainWindow.webContents.on('did-finish-load', () => {
    const pdfPath = path.join(__dirname, 'output.pdf');
    mainWindow.webContents.printToPDF({ printBackground: true }).then(data => {
      fs.writeFile(pdfPath, data, (err) => {
        if (err) return console.error('❌ PDF ذخیره نشد:', err);
        console.log('✅ PDF ذخیره شد در:', pdfPath);
      });
    }).catch(err => console.error('❌ خطا در تولید PDF:', err));
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// فقط یکبار Express را راه‌اندازی کن
app.whenReady().then(() => {
  expressApp.listen(port, () => {
    console.log(`🚀 Express اجرا شد: http://localhost:${port}`);
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
