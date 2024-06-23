/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:44:53
 * @LastEditors: June
 * @LastEditTime: 2023-11-07 15:51:43
 */
interface INativeBridge {
  platform: string
  ipcRenderer: any
}

declare global {
  interface Window {
    nativeBridge: IElectronAPI
  }
}

export { global }
