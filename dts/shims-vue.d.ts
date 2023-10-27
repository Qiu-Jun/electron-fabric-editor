/*
 * @Author: June
 * @Description:
 * @Date: 2023-01-17 13:07:15
 * @LastEditors: June
 * @LastEditTime: 2023-10-28 00:05:02
 */
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

export as namespace vfe
declare module 'vfe' {
  export as namespace vfe
  export interface ICanvas extends fabric.Canvas {
    c: fabric.Canvas
    editor: Editor
  }
}
