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
