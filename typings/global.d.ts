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

declare type Recordable<T = any> = Record<string, T>

declare interface ViteEnv {
  readonly APP_FLAG: string
  readonly APP_TITLE: string
  readonly APP_BASE_PATH: string
  readonly APP_APIHOST: string
  readonly APP_ADMINAPIHOST: string
}
