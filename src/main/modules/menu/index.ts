/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-13 01:02:42
 * @LastEditors: June
 * @LastEditTime: 2023-11-08 12:32:08
 */
import { app, Menu } from 'electron'

const template: any = [
  {
    label: '窗口',
    submenu: [
      { label: '最小化', role: 'minimize' },
      { label: '退出', role: 'quit ' }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
      { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
    ]
  }
]

// 设置菜单栏, win表示当前窗口实例
const createMenu = () => {
  // darwin表示macOS，这里我们选择对macOS系统的创建应用内菜单 win32 (Windows), linux (Linux) 和 darwin (macOS)
  const _platform = process.platform
  const menu = Menu.buildFromTemplate(template)
  const name = app.getName()
  switch (_platform) {
    case 'darwin':
      // mac处理
      template.unshift({
        label: name,
        submenu: [
          {
            label: 'Quit ( 退出 )',
            accelerator: 'Command+Q',
            click: function () {
              app.quit()
            }
          }
        ]
      })
      Menu.setApplicationMenu(menu)
      break
    case 'win32':
      Menu.setApplicationMenu(menu)
      break
    case 'linux':
      Menu.setApplicationMenu(null)
      break
  }
}

export default createMenu
