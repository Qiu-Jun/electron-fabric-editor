/// <reference types="vite/client" />

// import { Object } from 'fabric/fabric-impl';

declare global {
  declare module 'fabric/fabric-impl' {}
}

export as namespace vfe
declare module 'vfe' {
  export as namespace vfe
  export interface ICanvas extends fabric.Canvas {
    c: fabric.Canvas
    editor: Editor
  }
}

import Editor from '@/lib/core'

declare global {
  interface Window {
    editor: Editor
  }
}

declare type Recordable<T = any> = Record<string, T>

declare interface ViteEnv {
  readonly APP_FLAG: string
  readonly APP_TITLE: string
  readonly APP_BASE_PATH: string
  readonly APP_APIHOST: string
  readonly APP_ADMINAPIHOST: string
}
