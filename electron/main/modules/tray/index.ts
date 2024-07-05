/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-13 00:57:21
 * @LastEditors: June
 * @LastEditTime: 2023-11-10 21:17:24
 */
import { app, Menu, Tray, nativeImage, dialog } from 'electron'
import path from 'path'
import pkg from '../../../../package.json'
import { appName } from '../../config'

import type { MessageBoxOptions, BrowserWindow as IBrowserWindow } from 'electron'

const initTray = (win: IBrowserWindow) => {
  const iconPath = path.join(__dirname, '../..', 'resources/tray.png').replace('/\\/g', '\\\\')
  const tray = new Tray(nativeImage.createFromPath(iconPath))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '关于',
      click: () => {
        const options: MessageBoxOptions = {
          type: 'info',
          title: `关于`,
          message: `关于${pkg.name}\n当前版本 ${pkg.version}`,
          buttons: []
        }
        dialog.showMessageBox(options)
      }
    },
    {
      label: '设置',
      submenu: [
        {
          label: '开机自启',
          type: 'checkbox',
          checked: app.getLoginItemSettings().openAtLogin,
          click: function () {
            const curStatus = app.getLoginItemSettings().openAtLogin
            if (process.platform === 'darwin') {
              app.setLoginItemSettings({
                openAtLogin: !curStatus,
                path: process.execPath,
                openAsHidden: true //  用户可以从系统首选项中编辑此设置, 以便在打开应用程序时检查
              })
            } else if (process.platform === 'win32') {
              app.setLoginItemSettings({
                openAtLogin: !curStatus,
                path: process.execPath,
                args: ['--openAsHidden']
              })
            } else {
              app.setLoginItemSettings({
                openAtLogin: !curStatus,
                path: process.execPath
              })
            }
          }
        }
        // {
        //   label: '检查更新',
        //   click: () => {
        //     const winMange = WindowManage.getInstance()
        //     const winid = global.winModulesMap.get(appUpdate)?.id || 0
        //     const win = winMange.getWin(winid)
        //     win?.show()
        //     checkUpdate()
        //   }
        // }
      ]
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
  appName && tray.setToolTip(appName) // 鼠标指针在托盘图标上悬停时显示的文本
  // Call this again for Linux because we modified the context menu
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    win?.show()
  })
}

export default initTray
