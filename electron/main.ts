import { app, BrowserWindow, ipcMain, globalShortcut, screen } from 'electron'
import path from 'path'

let mainWindow: BrowserWindow | null = null
let displayWindow: BrowserWindow | null = null
let stageMonitorWindow: BrowserWindow | null = null

const isDev = !app.isPackaged

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  })

  const startUrl = isDev
    ? 'http://localhost:5173?window=main'
    : `file://${path.join(__dirname, '../dist/index.html')}?window=main`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const createDisplayWindow = () => {
  const displays = screen.getAllDisplays()
  const secondDisplay = displays.length > 1 ? displays[1] : displays[0]

  displayWindow = new BrowserWindow({
    x: secondDisplay.bounds.x,
    y: secondDisplay.bounds.y,
    width: secondDisplay.bounds.width,
    height: secondDisplay.bounds.height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    fullscreen: true,
    show: false,
  })

  const startUrl = isDev
    ? 'http://localhost:5173?window=display'
    : `file://${path.join(__dirname, '../dist/index.html')}?window=display`

  displayWindow.loadURL(startUrl)
  displayWindow.once('ready-to-show', () => displayWindow?.show())

  displayWindow.on('closed', () => {
    displayWindow = null
  })
}

const createStageMonitorWindow = () => {
  const displays = screen.getAllDisplays()
  const thirdDisplay = displays.length > 2 ? displays[2] : displays[0]

  stageMonitorWindow = new BrowserWindow({
    x: thirdDisplay.bounds.x,
    y: thirdDisplay.bounds.y,
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false,
  })

  const startUrl = isDev
    ? 'http://localhost:5173?window=stage-monitor'
    : `file://${path.join(__dirname, '../dist/index.html')}?window=stage-monitor`

  stageMonitorWindow.loadURL(startUrl)
  stageMonitorWindow.once('ready-to-show', () => stageMonitorWindow?.show())

  stageMonitorWindow.on('closed', () => {
    stageMonitorWindow = null
  })
}

app.on('ready', () => {
  createWindow()

  // Setup global hotkeys
  globalShortcut.register('CommandOrControl+D', () => {
    if (!displayWindow) {
      createDisplayWindow()
    } else {
      displayWindow.show()
    }
  })

  globalShortcut.register('CommandOrControl+S', () => {
    if (!stageMonitorWindow) {
      createStageMonitorWindow()
    } else {
      stageMonitorWindow.show()
    }
  })

  globalShortcut.register('CommandOrControl+M', () => {
    mainWindow?.focus()
  })
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC Handlers
ipcMain.handle('open-display-window', () => {
  if (!displayWindow) {
    createDisplayWindow()
  } else {
    displayWindow.show()
  }
})

ipcMain.handle('close-display-window', () => {
  if (displayWindow) {
    displayWindow.hide()
  }
})

ipcMain.handle('open-stage-monitor', () => {
  if (!stageMonitorWindow) {
    createStageMonitorWindow()
  } else {
    stageMonitorWindow.show()
  }
})

ipcMain.handle('close-stage-monitor', () => {
  if (stageMonitorWindow) {
    stageMonitorWindow.hide()
  }
})

ipcMain.handle('send-to-display', (_event, data) => {
  if (displayWindow && !displayWindow.isDestroyed()) {
    displayWindow.webContents.send('display-update', data)
  }
})

ipcMain.handle('send-to-stage-monitor', (_event, data) => {
  if (stageMonitorWindow && !stageMonitorWindow.isDestroyed()) {
    stageMonitorWindow.webContents.send('stage-update', data)
  }
})

ipcMain.handle('get-window-type', (event) => {
  const url = event.sender.getURL()
  const urlParams = new URL(url)
  const windowType = urlParams.searchParams.get('window') || 'main'
  return windowType
})
