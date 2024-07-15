/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-25 15:50:30
 * @LastEditors: June
 * @LastEditTime: 2023-11-07 16:45:13
 */
import { contextBridge, ipcRenderer } from 'electron'
import os from 'os'

const listeners = {}

// 注册上下文隔离接口
contextBridge.exposeInMainWorld('nativeBridge', {
  platform: os.platform(),
  ipcRenderer,
  onRenderMsg: (fn) => {
    const saferFn = (event, ...args) => fn(...args)
    ipcRenderer.on('response', saferFn)
    const key = Symbol()
    listeners[key] = saferFn
    return key
  },
  removeResponseHandler: (key) => {
    const fn = listeners[key]
    delete listeners[key]
    ipcRenderer.removeListener('response', fn)
  },
  onAppUpdateMsg: (fn) => {
    const saferFn = (_, ...args) => fn(...args)
    ipcRenderer.on('updatemessage', saferFn)
  }
})

// 默认有个 event 事件参数
ipcRenderer.on('show', () => {
  const root = document.querySelector('#app') as HTMLElement
  root.style.animation = 'show 0.3s linear forwards'
})

ipcRenderer.on('hide', (_, s: number) => {
  const root = document.querySelector('#app') as HTMLElement
  root.style.animation = `hide ${s}s linear forwards`
})
