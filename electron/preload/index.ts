/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-25 15:50:30
 * @LastEditors: June
 * @LastEditTime: 2023-05-22 14:31:33
 */
import { ipcRenderer, contextBridge } from 'electron'
import os from 'os'

// 对应下面的 win.webContents.send("show");
// 默认有个 event 事件参数
ipcRenderer.on('show', (e) => {
  const root = document.querySelector('#app') as HTMLElement
  root.style.animation = 'show 0.3s linear forwards'
})

// 对应下面的 win.webContents.send("hide", s);
ipcRenderer.on('hide', (e, s: number) => {
  const root = document.querySelector('#app') as HTMLElement
  root.style.animation = `hide ${s}s linear forwards`
})

// 注册上下文隔离接口
contextBridge.exposeInMainWorld('electronAPI', {
  platform: os.platform(),
  ipcRenderer
})

ipcRenderer.on('updatemessage', (type, text) => {
  console.log(type, text)
})
