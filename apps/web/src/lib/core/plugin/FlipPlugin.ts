import { fabric } from 'fabric'
import type Editor from '../Editor'
import { SelectMode } from '../eventType'
import { i18n } from '@/locales'
export default class FlipPlugin implements IPluginTempl {
  static pluginName = 'FlipPlugin'
  static apis = ['flip']
  constructor(
    public canvas: fabric.Canvas,
    public editor: Editor
  ) {}

  flip(type: 'X' | 'Y') {
    const activeObject = this.canvas.getActiveObject()
    if (activeObject) {
      activeObject.set(`flip${type}`, !activeObject[`flip${type}`]).setCoords()
      this.canvas.requestRenderAll()
    }
  }

  contextMenu() {
    const selectedMode = this.editor.getSelectMode()
    if (selectedMode === SelectMode.ONE) {
      return [
        {
          text: '翻转',
          hotkey: '❯',
          subitems: [
            {
              text: i18n.global.t('editor.flip.x'),
              hotkey: '|',
              onclick: () => this.flip('X')
            },
            {
              text: i18n.global.t('editor.flip.y'),
              hotkey: '-',
              onclick: () => this.flip('Y')
            }
          ]
        }
      ]
    }
  }

  destroy() {
    console.log('pluginDestroy')
  }
}
