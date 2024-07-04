import { BrowserWindow, shell } from 'electron'

export type Options = {
  loadURL: string | undefined
  loadFile: string
  baseOptions: Electron.BrowserWindowConstructorOptions
}

export interface winNewOptions extends Electron.BrowserWindowConstructorOptions {
  moduleName: string
  url?: string
  titlebarStyle: string
}

export class WinManage {
  loadURL?: string
  loadFile: string
  baseOptions: Electron.BrowserWindowConstructorOptions
  private winModalMap: Map<string, BrowserWindow>
  private winIdsMap: Map<number, string>
  constructor(options: Options) {
    this.loadURL = options.loadURL
    this.loadFile = options.loadFile
    this.baseOptions = options.baseOptions
    this.winModalMap = new Map()
    this.winIdsMap = new Map()
  }

  static instance: WinManage

  static initialize(options: Options) {
    if (!this.instance) {
      this.instance = new WinManage(options)
    }
    return this.instance
  }

  static getInstance() {
    return this.instance
  }

  getWin(moduleName: string) {
    return this.winModalMap.get(moduleName)
  }

  getIdWin(winId: number) {
    const moduleName = this.winIdsMap.get(winId)
    if (!moduleName) return
    const win = this.winModalMap.get(moduleName)
    return win
  }

  getWinds() {
    return this.winModalMap
  }

  removeWin(winId: number) {
    const moduleName = this.winIdsMap.get(winId)
    try {
      if (!moduleName) return
      const win = this.winModalMap.get(moduleName)
      this.winIdsMap.delete(winId)
      this.winModalMap.delete(moduleName)
      win?.close()
    } catch (error) {
      console.log(error)
    }
  }

  getNewWindowOptions(options: winNewOptions): Electron.BrowserWindowConstructorOptions {
    return { ...this.baseOptions, ...options }
  }

  newWindow(options: winNewOptions) {
    const moduleName = options.moduleName
    if (this.winModalMap.has(moduleName)) {
      return this.winModalMap.get(moduleName)
    }
    const win = new BrowserWindow({ ...this.baseOptions, ...options })
    this.winIdsMap.set(win.id, moduleName)
    this.winModalMap.set(moduleName, win)
    win.on('close', () => {
      this.removeWin(win.id)
    })

    win.on('ready-to-show', () => {
      win.webContents.send('setWinInfo', {
        winViewId: win.id,
        winViewModule: moduleName
      })
      win.show()
    })

    win.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    let path = options.url || ''
    path = '#' + path
    if (this.loadURL) {
      win.loadURL(this.loadURL + path)
    } else {
      win.loadFile(this.loadFile, {
        hash: path
      })
    }
    return win
  }
}
