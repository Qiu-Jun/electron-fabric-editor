/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-06 00:39:19
 * @LastEditors: June
 * @LastEditTime: 2023-11-08 11:38:39
 */
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

const updateUrl = 'https://3k2j857423.goho.co/static/el'
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
  checkUpdate()
  // 下载错误
  autoUpdater.on('error', (err) => {
    console.log(err, '------')
  })
  // 是否需要更新
  autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update')
  })
  // 可以更新
  autoUpdater.on('update-available', (e: any) => {
    console.log('update-available')
    autoUpdater.downloadUpdate()
  })
  // 不需要更新
  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available')
  })
  // 更新下载进度事件 暂时没有做进度处理
  autoUpdater.on('download-progress', (progress) => {
    console.log(progress)
  })

  // 下载更新完后
  autoUpdater.on('update-downloaded', function () {
    // 开始更新
    dialog
      .showMessageBox({
        title: '升级提示！',
        message: '已为您下载最新应用，点击确定马上替换为最新版本！'
      })
      .then(() => {
        //重启应用并在下载后安装更新。 它只应在发出 update-downloaded 后方可被调用。
        autoUpdater.quitAndInstall()
      })
  })
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
