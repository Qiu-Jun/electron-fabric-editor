/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-06 00:39:19
 * @LastEditors: June
 * @LastEditTime: 2023-11-08 11:38:39
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

// "publish": [
//     {
//       "provider": "generic",
//       "url": "http://localhost:3000/static/el"
//     }
//   ],
const updateUrl = 'http://localhost:3000/static/el'
const provider = 'generic'
const message: Record<string, string> = {
  error: '检查更新出错',
  checking: '正在检查更新…',
  updateAvailable: '检查到新版本',
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
  autoUpdater.autoDownload = true // 是否自动下载
  autoUpdater.setFeedURL({
    provider,
    url: updateUrl
  })

  // 下载错误
  autoUpdater.on('error', (err) => {
    sendUpdateMessage(win, { type: 'updateErr', text: `${message.error}: ${err}` })
  })
  // 是否需要更新
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(win, { type: 'updateChecking', text: message.checking })
  })
  // 可以更新
  autoUpdater.on('update-available', (e: any) => {
    sendUpdateMessage(win, { type: 'needUpdate', text: `${message.updateAvailable}-v${e.version}` })
  })
  // 不需要更新
  autoUpdater.on('update-not-available', () => {
    sendUpdateMessage(win, {
      type: 'notNeedUpdate',
      text: message.updateNotAvailable
    })
  })
  // 更新下载进度事件 暂时没有做进度处理
  autoUpdater.on('download-progress', (progress) => {
    sendUpdateMessage(win, {
      type: 'download-progress',
      text: Number(progress.percent)
    })
  })

  // 下载更新完后
  autoUpdater.on('update-downloaded', function () {
    // 开始更新
    autoUpdater.quitAndInstall()
    // app.quit()
    sendUpdateMessage(win, { type: 'download', text: message.downloaded })
  })

  //   // 手动触发更新
  //   ipcMain.on('checkForUpdate', () => {
  //     // 执行自动更新检查
  //     autoUpdater.checkForUpdates()
  //   })

  ipcMain.on('doanloadNewVersion', downloadUpdateApp)
}

export const checkUpdate = () => {
  autoUpdater.checkForUpdates() // 检查更新
  autoUpdater.checkForUpdatesAndNotify() // 检查更新并通知
}

// 下载
export const downloadUpdateApp = () => {
  autoUpdater.downloadUpdate()
}
// 安装更新
export const intsallUpdateApp = () => {
  autoUpdater.quitAndInstall() // 退出并安装更新
  app.quit()
}
