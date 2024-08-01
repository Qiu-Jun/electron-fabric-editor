/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:47:21
 * @LastEditors: June
 * @LastEditTime: 2023-11-08 11:38:58
 */
import { app, BrowserWindow } from 'electron'
import initTray from './modules/tray/index'
import createMenu from './modules/menu/index'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import path from 'path'
import { WinManage } from './utils/winManage'
import { is, appMain } from './constants'
import { appLoadUrl, appUpdateUrl } from './config'
import { initUpdate } from './utils/update'

const getLock = app.requestSingleInstanceLock()
let win: any = null

function startApp() {
  // 返回false 说明已有应用了

  if (!getLock) {
    win?.isMinimized() && win?.restore()
    win?.focus()
  }

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron.june_fabric')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()
    app.on('activate', () => {
      // 当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、
      // 尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    initTray(win.getWin(appMain))
    createMenu()
    // initUpdate()
  })

  // 除了 macOS 外，当所有窗口都被关闭的时候退出程序
  app.on('window-all-closed', () => {
    // process.platform Electron 目前只支持三个平台：win32 (Windows), linux (Linux) 和 darwin (macOS)
    if (process.platform !== 'darwin') app.quit()
  })

  // 客户端聚焦
  // app.on('browser-window-focus', () => { })

  // // 客户端失去焦点
  // app.on('browser-window-blur', () => { })

  app.on('activate', () => win?.show())
}

startApp()

function createWindow(): void {
  win = WinManage.initialize({
    loadURL: is.dev ? appLoadUrl : '',
    loadFile: is.dev ? '' : path.join(__dirname, '..', '/dist/index.html'),
    baseOptions: {
      width: 1600,
      height: 960,
      show: false,
      frame: true,
      autoHideMenuBar: true,
      resizable: true,
      icon: path.join(__dirname, '../..', 'resources/icon.png'),
      webPreferences: {
        webSecurity: false, // 同源策略
        contextIsolation: true, // 开启上下文隔离
        nodeIntegration: true,
        preload: path.join(__dirname, '..', 'preload/index.js'),
        sandbox: false
      }
    }
  })
  win.newWindow({
    url: '/',
    moduleName: appMain
  })
}
