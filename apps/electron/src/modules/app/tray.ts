import type { MessageBoxOptions } from 'electron'
import { app, dialog, Menu, Tray } from 'electron'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { getMainWindow } from '/@/modules/app/mainWindow'

let tray: Tray
/** Create or refresh the tray */
export async function createTray() {
  await setTimeout()
  // Reuse the existing tray instance if it is already there
  if (tray) {
    tray.setContextMenu(createContextMenu())
    return tray
  }

  const iconPath = path.join(import.meta.dirname, '..', 'resources/tray.png')
  // Construct the tray icon
  tray = new Tray(iconPath)
  // Set the tooltip text
  tray.setToolTip(app.getName())

  // Load the tray menu
  tray.setContextMenu(createContextMenu())
  // Show the main window on click
  tray.on('click', () => {
    getMainWindow()?.show()
    getMainWindow()?.setSkipTaskbar(false)
  })
  return tray
}

/** Build the tray menu */
function createContextMenu() {
  return Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        getMainWindow()?.show()
      },
    },
    {
      label: '关于',
      click: () => {
        const options: MessageBoxOptions = {
          type: 'info',
          title: `关于`,
          message: `当前版本 ${app.getVersion()}`,
          buttons: [],
        }
        dialog.showMessageBox(options)
      },
    },
    // {
    //   label: '开机自启',
    //   type: 'checkbox',
    //   checked: app.getLoginItemSettings().openAtLogin,
    //   click() {
    //     const curStatus = app.getLoginItemSettings().openAtLogin
    //     if (process.platform === 'darwin') {
    //       app.setLoginItemSettings({
    //         openAtLogin: !curStatus,
    //         path: process.execPath,
    //         openAsHidden: true, //  用户可以从系统首选项中编辑此设置, 以便在打开应用程序时检查
    //       })
    //     }
    //     else if (process.platform === 'win32') {
    //       app.setLoginItemSettings({
    //         openAtLogin: !curStatus,
    //         path: process.execPath,
    //         args: ['--openAsHidden'],
    //       })
    //     }
    //     else {
    //       app.setLoginItemSettings({
    //         openAtLogin: !curStatus,
    //         path: process.execPath,
    //       })
    //     }
    //   },
    // },
    {
      label: '退出',
      click: () => {
        tray.destroy()
        getMainWindow()?.destroy()
      },
    },
  ])
}

export function getTray() {
  return tray
}
