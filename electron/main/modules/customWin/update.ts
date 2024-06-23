/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-22 11:51:12
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 13:30:36
 */
import electron, { ipcMain, app, BrowserWindow } from 'electron'
import WindowManage from '../../utils/win'
import path from 'path'
import { appUpdate } from '../../config/constants/winNames'

const winURL = `http://localhost:5173/#/update`
let win: BrowserWindow
const createUpdateWindow = function () {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
  win = WindowManage.getInstance().createWin({
    module: appUpdate,
    width: 300,
    height: 360,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true, // 任务栏中不显示窗口
    closable: false,
    hasShadow: false,
    urlhash: 'update'
  })
  return win
}

ipcMain.on('updateHide', () => {
  win?.hide()
})

ipcMain.on('updateShow', () => {
  win?.show()
  win?.focus()
})

ipcMain.handle('updateGetBounds', () => {
  return win?.getBounds()
})

ipcMain.handle('updateSetBounds', (event, param) => {
  const { x, y, width, height } = param
  return win?.setBounds({
    x,
    y,
    width,
    height
  })
})

ipcMain.handle('updateSetSize', (event, param) => {
  const { width, height } = param
  win?.setResizable(true)
  win?.setSize(width, height)
  win?.setResizable(false)
})

app.commandLine.appendSwitch('wm-window-animations-disabled')

export default createUpdateWindow
