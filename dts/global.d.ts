/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:44:53
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 05:28:13
 */
interface IElectronAPI {
  platform: string
  ipcRenderer: any
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}

export { global }
