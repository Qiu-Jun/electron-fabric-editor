/*
 * @Author: June
 * @Description:
 * @Date: 2024-11-10 11:32:24
 * @LastEditors: June
 * @LastEditTime: 2024-11-10 11:32:36
 */
import { fabric } from 'fabric'
import type { IEditor, IPluginTempl } from '@/lib/core'

class MiddleMousePlugin implements IPluginTempl {
  static pluginName = 'MiddleMousePlugin'
  workspaceEl!: HTMLElement

  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {
    this.init()
  }

  private init() {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!')
    }
    this.workspaceEl = workspaceEl
    this.initListener()
  }

  private handleMouseUp = (e: MouseEvent) =>
    e.button === 1 && this.canvas.fire('mouse:up', { e })

  private handleMouseDown = (e: MouseEvent) =>
    e.button === 1 && this.canvas.fire('mouse:down', { e })

  /**
   * @desc 初始化鼠标中键监听事件
   */
  private initListener() {
    this.workspaceEl.addEventListener('mouseup', this.handleMouseUp)
    this.workspaceEl.addEventListener('mousedown', this.handleMouseDown)
  }

  destroy() {
    this.workspaceEl.removeEventListener('mouseup', this.handleMouseUp)
    this.workspaceEl.removeEventListener('mousedown', this.handleMouseDown)
    console.log('pluginDestroy')
  }
}

export default MiddleMousePlugin
