/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-04 14:26:20
 * @LastEditors: June
 * @LastEditTime: 2023-11-06 01:12:57
 */
import { app, BrowserWindow, dialog, shell, MenuItem } from 'electron'
import path from 'path'
import { merge } from 'lodash-es'
import pkg from '../../../package.json'

interface ICreateWinOps {
  module: string // 窗口模块名称
  center?: boolean // 打开新窗口是否显示在屏幕中心
  url?: string
  width?: number
  height?: number
  [key: string]: any
}

class WindowManage {
  constructor() {
    // dosomethimg
  }

  static instance: WindowManage

  static getInstance() {
    if (!this.instance) {
      this.instance = new WindowManage()
    }
    return this.instance
  }

  defaultWinOps = {
    width: 1080,
    height: 960,
    show: false,
    transparent: false, // 窗口透明 透明窗口无法通过鼠标改变大小
    autoHideMenuBar: true, // 自动隐藏菜单栏
    frame: true, // 设置为 false 时可以创建一个无边框窗口 默认值为 true
    icon: path.join(__dirname, '../..', 'public/icon.png'),
    // alwaysOnTop: true, // 窗口置顶
    webPreferences: {
      webSecurity: true, // 它将禁用同源策略 (通常用来测试网站), 如果此选项不是由开发者设置的，还会把 allowRunningInsecureContent设置为 true
      contextIsolation: true, // 开启上下文隔离
      nodeIntegration: true,
      preload: path.join(__dirname, '..', 'preload/index.js')
    }
  }

  // 创建窗口
  createWin(options: ICreateWinOps): BrowserWindow {
    if (!options || Object.prototype.toString.call(options) !== '[object Object]')
      throw new Error('必须传入窗口参数')
    //通过创建窗口模块名称判断是否已经存在，存在就获取焦点，并将数据通过ipc通知到该窗口
    if (global.winModulesMap.has(options.module)) {
      const id = global.winModulesMap.get(options.module)?.id || 0
      const win = global.BrowserWindowsMap.get(id)
      win?.focus()
      // const params = getRequest(options.url || '')
      // win?.webContents.send('uploadData', params)
      return win
    }
    options.url = options.url || ''
    const currentWindow = BrowserWindow.getFocusedWindow()
    const pos: { x: number | undefined; y: number | undefined } = {
      x: undefined,
      y: undefined
    }
    //如果已经有打开的窗口，并且新窗口不是居于屏幕中央，则相对于上一个窗口进行偏移
    if (currentWindow && !options.center) {
      const [currentWindowX, currentWindowY] = currentWindow.getPosition()
      pos.x = currentWindowX ? currentWindowX + 30 : 0
      pos.y = currentWindowY ? currentWindowY + 30 : 0
    }
    const browserOps = merge({}, this.defaultWinOps, options, pos)
    const mainWindow = new BrowserWindow(browserOps)
    !app.isPackaged && mainWindow.webContents.openDevTools()

    mainWindow.on('ready-to-show', () => {
      //在窗口刷新时将窗口信息发送到渲染进程，方便指定窗口交互
      mainWindow.webContents.send('setWinInfo', {
        winViewId: mainWindow.id,
        winViewModule: options.module
      })
      mainWindow.show()
    })

    mainWindow.webContents.on('did-fail-load', () => {
      dialog.showMessageBox({
        type: 'error',
        title: '窗口打开失败',
        message: `关于${pkg.name}\n当前版本 ${pkg.version}`
      })
      // this.delWin(mainWindow.id)
    })
    //开发模式下拼接打开路由
    if (app.isPackaged) {
      //打包后读取文件，并使用哈希打开指定路由
      mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'), {
        hash: options.hash || '/'
      })
    } else {
      const openUrl = options.toUrl
        ? options.toUrl
        : `http://localhost:3000/${options.urlhash ? '#/' + options.urlhash : ''}`
      mainWindow.loadURL(openUrl)
    }
    //将窗口信息存储到map
    global.BrowserWindowsMap.set(mainWindow.id, mainWindow)
    global.winModulesMap.set(options.module, { id: mainWindow.id, url: options.url || '' })
    return mainWindow
  }

  // 获取窗口
  getWin(winId: string | number) {
    return global.BrowserWindowsMap.get(winId)
  }

  // 删除窗口
  async delWin(winId: string | number, winModuleId?: string) {
    if (!winId) return
    const win = global.BrowserWindowsMap.get(winId)
    await win?.destroy()
    global.BrowserWindowsMap.delete(winId)
    winModuleId && global.winModulesMap.delete(winModuleId)
  }
}

export default WindowManage
