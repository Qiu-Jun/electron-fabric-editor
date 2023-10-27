/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-06 00:39:19
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 13:50:31
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

const message = {
  error: '检查更新出错',
  checking: '正在检查更新…',
  updateAva: '正在更新',
  updateNotAva: '已经是最新版本',
  downloadProgress: '正在下载...',
  downloaded: '更新下载完毕，立即更新'
}

export default function handleUpdate(win: BrowserWindow) {
  autoUpdater.autoDownload = false // 是否自动下载
  autoUpdater.setFeedURL('http://192.168.10.108:9000/')
  // 通过main进程发送事件给renderer进程，提示更新信息
  const sendUpdateMessage = ({
    type,
    text
  }: {
    type: string
    text: string | number
    info?: string
  }) => {
    win.webContents.send('updatemessage', { type, text })
  }
  // 下载错误
  autoUpdater.on('error', (err) => {
    sendUpdateMessage({ type: 'updateErr', text: `${message.error}: ${err}` })
  })
  // 是否需要更新
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage({ type: 'updateChecking', text: message.checking })
  })
  // 可以更新
  autoUpdater.on('update-available', () => {
    sendUpdateMessage({ type: 'needUpdate', text: `${message.updateAva}` })
  })
  // 不需要更新
  autoUpdater.on('update-not-available', () => {
    sendUpdateMessage({
      type: 'notNeedUpdate',
      text: message.updateNotAva
    })
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', (progress) => {
    sendUpdateMessage({
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
    sendUpdateMessage({ type: 'download', text: message.downloaded })
  })

  // 手动触发更新
  ipcMain.on('checkForUpdate', () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates()
  })

  ipcMain.on('downloadUpdate', () => {
    // 执行下载
    autoUpdater.downloadUpdate()
  })
}
