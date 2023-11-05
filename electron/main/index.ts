/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:47:21
 * @LastEditors: June
 * @LastEditTime: 2023-10-28 21:26:32
 */
import { app, BrowserWindow } from 'electron'
import initTray from './modules/tray/index'
import createMenu from './modules/menu/index'
import WindowManage from './utils/win'
// import createUpdateWindow from './modules/customWin/update'
// import handleUpdate from './utils/update'
import { appMain } from './config/constants/winNames'
type winModule = {
  id: string | number
  url: string
}

// key为winid, value   为窗口创建返回对象
global.BrowserWindowsMap = new Map<string | number, BrowserWindow>()
// key为窗口模块名称， 方便通过模块名查询
global.winModulesMap = new Map<string | number, winModule>()

let win: any = null
let willQuitApp = false
const createWindow = () => {
  // app.isPackaged 如果应用已经打包，返回true ，否则返回false
  // const isPackaged: boolean = app.isPackaged
  win = WindowManage.getInstance().createWin({
    module: appMain
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    // 当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、
    // 尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  win.on('close', (e) => {
    if (willQuitApp) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  })

  !app.isPackaged && win.webContents.openDevTools()
  // const updateWin = createUpdateWindow()
  initTray(win)
  createMenu()
  // handleUpdate(updateWin)
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

app.on('activate', () => win.show())

app.on('before-quit', () => (willQuitApp = true))
