/// <reference types="vite/client" />

declare type Recordable<T = any> = Record<string, T>

declare interface ViteEnv {
  readonly APP_FLAG: string
  readonly APP_TITLE: string
  readonly APP_BASE_PATH: string
  readonly APP_APIHOST: string
  readonly APP_ADMINAPIHOST: string
}
