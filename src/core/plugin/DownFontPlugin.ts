/*
 * @Author: 秦少卫
 * @Date: 2023-06-27 22:58:57
 * @LastEditors: June
 * @LastEditTime: 2024-03-21 14:36:39
 * @Description: 下载字体插件
 */
import { downFontByJSON } from '../utils'
import { fabric } from 'fabric'
import Editor from '../core'
type IEditor = Editor

class DownFontPlugin {
  public canvas: fabric.Canvas
  public editor: IEditor
  static pluginName = 'DownFontPlugin'
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas
    this.editor = editor
  }

  hookImportBefore(json: string) {
    // console.log(downFontByJSON(json).then, 111);
    return downFontByJSON(json)
  }

  destroy() {
    console.log('pluginDestroy')
  }
}

export default DownFontPlugin
