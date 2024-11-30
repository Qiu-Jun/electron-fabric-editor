/*
 * @Author: 秦少卫
 * @Date: 2024-07-06 12:34:00
 * @LastEditors: June
 * @LastEditTime: 2024-11-10 11:29:45
 * @Description: 基础元素类型添加
 */

import { fabric } from 'fabric'
import { v4 as uuid } from 'uuid'
import type { IEditor, IPluginTempl } from '@/lib/core'

type IPlugin = Pick<AddBaseTypePlugin, 'addBaseType' | 'createImgByElement'>

declare module '@/lib/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

export default class AddBaseTypePlugin implements IPluginTempl {
  static pluginName = 'AddBaseTypePlugin'
  static apis = ['addBaseType', 'createImgByElement']
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {
    this.editor = editor
    this.canvas = canvas
  }

  addBaseType(
    item: fabric.Object,
    optons?: {
      event: DragEvent
      scale: boolean
      center: boolean
    }
  ) {
    const { event = false, scale = false, center = true } = optons || {}
    item.set({
      id: uuid()
    })
    scale && this._toScale(item)
    event && this._toEvent(item, event)
    this.canvas.add(item)
    if (!event && center) {
      this._toCenter(item)
    }
    this.canvas.refreshHistory()
    this.canvas.setActiveObject(item)
    this.canvas.renderAll()
  }

  _toEvent(item: fabric.Object, event: DragEvent) {
    const { left, top } = this.canvas
      .getSelectionElement()
      .getBoundingClientRect()
    if (event.x < left || event.y < top || item.width === undefined) return
    const point = {
      x: event.x - left,
      y: event.y - top
    }
    const pointerVpt = this.canvas.restorePointerVpt(point)
    item.set({
      left: pointerVpt.x,
      top: pointerVpt.y
    })
  }

  _toCenter(item: fabric.Object) {
    this.canvas.setActiveObject(item)
    this.editor.position('center')
  }

  _toScale(item: fabric.Object) {
    const { width } = this.editor.getWorkspase()
    if (width === undefined) return
    item.scaleToWidth(width / 2)
  }

  createImgByElement(target: HTMLImageElement) {
    return new Promise((resolve) => {
      const imgType = this.getImageExtension(target.src)
      if (imgType === 'svg') {
        fabric.loadSVGFromURL(target.src, (objects) => {
          const item = fabric.util.groupSVGElements(objects, {
            shadow: '',
            fontFamily: 'arial',
            name: 'svg元素'
          })
          resolve(item)
        })
      } else {
        fabric.Image.fromURL(
          target.src,
          (imgEl) => {
            resolve(imgEl)
          },
          { crossOrigin: 'anonymous' }
        )
      }
    })
  }

  getImageExtension(imageUrl: string) {
    const pathParts = imageUrl.split('/')
    const filename = pathParts[pathParts.length - 1]
    const fileParts = filename.split('.')
    return fileParts[fileParts.length - 1]
  }

  destroy() {
    console.log('pluginDestroy')
  }
}
