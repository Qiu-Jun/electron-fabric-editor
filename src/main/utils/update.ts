/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-06 00:39:19
 * @LastEditors: June
 * @LastEditTime: 2023-11-08 11:38:39
 */
import { app, BrowserWindow, ipcMain, dialog, nativeImage } from 'electron'
import { autoUpdater } from 'electron-updater'
import { appUpdateUrl } from '../config'
import path from 'node:path'

const iconFile = path.join(__dirname, '../../..', '')
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

export function initUpdate() {
  if (!appUpdateUrl) return
  autoUpdater.forceDevUpdateConfig = true // 强制使用开发环境进行更新
  autoUpdater.autoDownload = false // 是否自动下载
  autoUpdater.setFeedURL({
    provider,
    url: appUpdateUrl
  })
  checkUpdate()
  // 监听升级失败事件
  autoUpdater.on('error', (err) => {
    dialog.showMessageBox({
      title: '提示',
      message: `下载错误`,
      icon: iconFile
    })
  })

  //监听发现可用更新事件
  autoUpdater.on('update-available', (e: any) => {
    dialog
      .showMessageBox({
        title: '更新提示',
        message: `您有新版本v${e.version}可更新，是否更新?`,
        icon: nativeImage.createFromPath(iconFile)
      })
      .then(downloadUpdateApp)
  })

  //监听没有可用更新事件
  // autoUpdater.on('update-not-available', () => {
  //   console.log('update-not-available')
  // })

  // 更新下载进度事件
  // autoUpdater.on('download-progress', (progress) => {
  //   console.log(progress)
  // })

  //监听下载完成事件
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        title: '更新提示',
        message: '已为您下载最新应用，是否更新最新版本？'
      })
      .then(intsallUpdateApp)
  })
}

export const checkUpdate = () => {
  autoUpdater.checkForUpdates() // 检查更新
  // autoUpdater.checkForUpdatesAndNotify() // 检查是否有可用的更新，如果有，用户会收到一个通知
}

// 下载
export function downloadUpdateApp() {
  autoUpdater.downloadUpdate()
}

// 安装更新
export function intsallUpdateApp() {
  autoUpdater.quitAndInstall() // 退出并安装更新
}
