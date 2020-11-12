const { app, BrowserWindow, globalShortcut, dialog, ipcMain   } = require('electron')
const shortcut = require('./utils/shortcut')
require('electron-reload')(__dirname);

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  // win.setMovable(true)
  win.loadFile('index.html')
  win.webContents.openDevTools()
}


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})