/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-06 00:39:19
 * @LastEditors: June
 * @LastEditTime: 2023-11-07 16:36:43
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

const updateUrl = 'http://localhost:3000/static/el'
const message: Record<string, string> = {
  error: '检查更新出错',
  checking: '正在检查更新…',
  updateAvailable: '正在更新',
  updateNotAvailable: '已经是最新版本',
  downloadProgress: '正在下载...',
  downloaded: '更新下载完毕，立即更新'
}

// 通过main进程发送事件给renderer进程，提示更新信息
const sendUpdateMessage = (
  win,
  {
    type,
    text
  }: {
    type: string
    text: string | number
    info?: string
  }
) => {
  win.webContents.send('updatemessage', { type, text })
}

export function initUpdate(win: BrowserWindow) {
  autoUpdater.forceDevUpdateConfig = true // 强制使用开发环境进行更新
  autoUpdater.autoDownload = false // 是否自动下载
  autoUpdater.setFeedURL(updateUrl)

  // 下载错误
  autoUpdater.on('error', (err) => {
    sendUpdateMessage(win, { type: 'updateErr', text: `${message.error}: ${err}` })
  })
  // 是否需要更新
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(win, { type: 'updateChecking', text: message.checking })
  })
  // 可以更新
  autoUpdater.on('update-available', () => {
    sendUpdateMessage(win, { type: 'needUpdate', text: `${message.updateAvailable}` })
  })
  // 不需要更新
  autoUpdater.on('update-not-available', () => {
    sendUpdateMessage(win, {
      type: 'notNeedUpdate',
      text: message.updateNotAvailable
    })
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', (progress) => {
    sendUpdateMessage(win, {
      type: 'download-progress',
      text: Number(progress.percent)
    })
  })
  // 下载更新完后
  autoUpdater.on('update-downloaded', function () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.on('isUpdateNow', (_e, _arg) => {
      // 开始更新
      autoUpdater.quitAndInstall()
      app.quit()
      // callback()
    })
    sendUpdateMessage(win, { type: 'download', text: message.downloaded })
  })

  //   // 手动触发更新
  //   ipcMain.on('checkForUpdate', () => {
  //     // 执行自动更新检查
  //     autoUpdater.checkForUpdates()
  //   })

  //   ipcMain.on('downloadUpdate', () => {
  //     // 执行下载
  //     autoUpdater.downloadUpdate()
  //   })
}

export const checkUpdate = () => {
  autoUpdater.checkForUpdates() // 检查更新
  autoUpdater.checkForUpdatesAndNotify() // 检查更新并通知
}

// 安装更新
export const intsallUpdateApp = () => {
  autoUpdater.quitAndInstall() // 退出并安装更新
}
