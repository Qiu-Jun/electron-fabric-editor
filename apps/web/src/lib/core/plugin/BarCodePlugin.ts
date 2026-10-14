/*
 * @Author: 秦少卫
 * @Date: 2024-06-06 14:12:24
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-07 21:24:56
 * @Description: 条形码生成工具
 */

import { fabric } from 'fabric'
import Editor from '../Editor'

type IEditor = Editor

// 条形码生成参数
// https://github.com/lindell/JsBarcode/wiki/Options

enum CodeType {
  CODE128 = 'CODE128',
  EAN8 = 'EAN8',
  EAN13 = 'EAN13',
  ITF14 = 'ITF14',
  codabar = 'codabar',
  pharmacode = 'pharmacode'
}

class BarCodePlugin implements IPluginTempl {
  static pluginName = 'BarCodePlugin'
  static apis = ['addBarcode', 'setBarcode', 'getBarcodeTypes']
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {}

  async hookTransform(object: any) {
    if (object.extensionType === 'barcode') {
      const url = await this._getBase64Str(object.extension)
      object.src = url
    }
  }
  async _getBase64Str(option: any) {
    // 按需加载条形码库，避免进入首屏包
    const { default: JsBarcode } = await import('jsbarcode')
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, option.value, {
      ...option
    })
    const url = canvas.toDataURL('image/png', 1)
    return url
  }

  _defaultBarcodeOption() {
    return {
      value: '123456',
      format: CodeType.CODE128,
      text: 'hi kuaitu',
      textAlign: 'left',
      textPosition: 'bottom',
      fontSize: 12,
      background: '#fff',
      lineColor: '#000',
      displayValue: false
    }
  }

  async addBarcode() {
    const option = this._defaultBarcodeOption()
    const url = await this._getBase64Str(JSON.parse(JSON.stringify(option)))
    fabric.Image.fromURL(
      url,
      (imgEl) => {
        imgEl.set({
          extensionType: 'barcode',
          extension: option
        })
        imgEl.scaleToWidth(this.editor.getWorkspase().getScaledWidth() / 2)
        this.canvas.add(imgEl)
        this.canvas.setActiveObject(imgEl)
        this.editor.position('center')
        this.canvas.renderAll()
        this.editor.saveState()
      },
      { crossOrigin: 'anonymous' }
    )
  }

  async setBarcode(option: any) {
    try {
      const url = await this._getBase64Str(option)
      const activeObject = this.canvas.getActiveObjects()[0]
      fabric.Image.fromURL(
        url,
        (imgEl) => {
          imgEl.set({
            left: activeObject.left,
            top: activeObject.top,
            extensionType: 'barcode',
            extension: { ...option }
          })
          imgEl.scaleToWidth(activeObject.getScaledWidth())
          this.editor.del()
          this.canvas.add(imgEl)
          this.canvas.setActiveObject(imgEl)
        },
        { crossOrigin: 'anonymous' }
      )
    } catch (error) {
      // 错误已忽略，不影响主流程
    }
  }

  getBarcodeTypes() {
    return Object.values(CodeType)
  }

  destroy() {}
}

export default BarCodePlugin
