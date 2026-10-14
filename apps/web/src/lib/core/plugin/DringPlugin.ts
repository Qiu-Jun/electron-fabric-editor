/*
 * @Author: 秦少卫
 * @Date: 2023-05-19 08:31:34
 * @LastEditors: June
 * @LastEditTime: 2024-11-10 11:31:24
 * @Description: 拖拽插件
 */

import { IEditor, IPluginTempl } from '@/lib/core'

type IPlugin = Pick<DringPlugin, 'startDring' | 'endDring'>

declare module '@/lib/core' {
  interface IEditor extends IPlugin {}
}

export class DringPlugin implements IPluginTempl {
  defautOption = {}
  static pluginName = 'DringPlugin'
  static events = ['startDring', 'endDring']
  static apis = ['startDring', 'endDring']
  hotkeys: string[] = ['space']
  dragMode = false
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {
    this.dragMode = false
    this.init()
  }
  init() {
    this._initDring()
  }

  startDring() {
    this.dragMode = true
    this.canvas.setCursor('grab')
    this.editor.emit('startDring')
    this.canvas.renderAll()
  }
  endDring() {
    this.dragMode = false
    this.canvas.setCursor('default')
    this.canvas.isDragging = false
    this.editor.emit('endDring')
    this.canvas.renderAll()
  }

  // 拖拽模式;
  _initDring() {
    const that = this
    this.canvas.on('mouse:down', function (this: ExtCanvas, opt) {
      const evt = opt.e
      // evt.button === 1 为鼠标中键的判断
      if (evt.altKey || that.dragMode || evt.button === 1) {
        that.canvas.setCursor('grabbing')
        that.canvas.discardActiveObject()
        that._setDring()
        this.selection = false
        this.isDragging = true
        this.lastPosX = evt.clientX
        this.lastPosY = evt.clientY
        this.requestRenderAll()
      }
    })

    this.canvas.on('mouse:move', function (this: ExtCanvas, opt) {
      that.dragMode && that.canvas.setCursor('grab')
      if (this.isDragging) {
        that.canvas.discardActiveObject()
        that.canvas.setCursor('grabbing')
        const { e } = opt
        if (!this.viewportTransform) return
        const vpt = this.viewportTransform
        vpt[4] += e.clientX - this.lastPosX
        vpt[5] += e.clientY - this.lastPosY
        this.lastPosX = e.clientX
        this.lastPosY = e.clientY
        this.requestRenderAll()
      }
    })

    this.canvas.on('mouse:up', function (this: ExtCanvas) {
      if (!this.viewportTransform) return
      this.setViewportTransform(this.viewportTransform)
      this.isDragging = false
      this.selection = true
      this.getObjects().forEach((obj) => {
        if (obj.id !== 'workspace' && obj.hasControls) {
          obj.selectable = true
        }
      })
      that.dragMode && that.canvas.setCursor('grab')
      this.requestRenderAll()
    })
  }

  _setDring() {
    this.canvas.selection = false
    this.canvas.getObjects().forEach((obj) => {
      obj.selectable = false
    })
    this.canvas.requestRenderAll()
  }

  destroy() {}

  // 快捷键扩展回调

  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.code === 'Space' && e.type === 'keydown') {
      if (!this.dragMode) {
        this.startDring()
      }
    }
    if (e.code === 'Space' && e.type === 'keyup') {
      this.endDring()
    }
  }
}

declare global {
  export type ExtCanvas = fabric.Canvas & {
    isDragging: boolean
    lastPosX: number
    lastPosY: number
  }
}

export default DringPlugin
