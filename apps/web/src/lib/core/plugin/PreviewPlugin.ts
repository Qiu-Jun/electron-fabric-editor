/*
 * @Author: June
 * @Description: 页面缩略图实时预览插件,监听画布渲染生成blob缩略图
 * @Date: 2026-09-04 16:30:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 16:30:00
 * @FilePath: \element-fabric-editor\src\lib\core\plugin\PreviewPlugin.ts
 */
import { fabric } from 'fabric'
import { debounce } from 'lodash-es'
import Editor from '../Editor'
import { useTemplateStoreWithOut } from '@/store/modules/template'
import type { Template } from '@/types/template'

type IEditor = Editor

// 缩略图目标宽度;页面卡片显示184px,留retina余量
const THUMB_WIDTH = 240

export default class PreviewPlugin implements IPluginTempl {
  static pluginName = 'PreviewPlugin'
  static events = []
  static apis = ['capturePreview']
  debouncedCapture = debounce(() => this.capture(), 300)

  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {
    canvas.on('after:render', this.debouncedCapture)
  }

  // 立即截图;切页前强制把当前画面写入指定页面,绕过switching守卫
  capturePreview(tpl?: Template) {
    this.capture(tpl ?? useTemplateStoreWithOut().curTemplate, true)
  }

  private capture(tpl?: Template, force = false) {
    const store = useTemplateStoreWithOut()
    // 切页过程中的过渡渲染不截图
    if (!force && (store.switching || store.curTempIdx < 0)) return
    const target = tpl ?? store.curTemplate
    if (!target) return
    // 裁剪到画板的实际显示区域;toCanvasElement的裁剪参数是屏幕(视口)坐标,
    // 需把画板对象坐标先经视口变换换算,否则缩放平移后截图偏移且含大量空白
    const ws = this.canvas.getObjects().find((o) => o.id === 'workspace')
    const vpt = this.canvas.viewportTransform
    if (!ws || !ws.width || !ws.height || !vpt) return
    const zoom = vpt[0]
    const width = ws.width * (ws.scaleX ?? 1) * zoom
    const height = ws.height * (ws.scaleY ?? 1) * zoom
    if (!width || !height) return
    const mult = Math.min(1, THUMB_WIDTH / width)
    // toCanvasElement渲染离屏画布时会触发after:render(fabric renderCanvas实现),
    // 此时视口是临时的截图变换:标尺等监听者会按错误视口计算绘制(滚动条手柄错位),
    // 本插件也会重入导致循环截图。故截图期间挂起全部after:render监听
    const eventListeners = (this.canvas as any).__eventListeners
    const savedRenderListeners = eventListeners?.['after:render']
    if (eventListeners && savedRenderListeners) {
      eventListeners['after:render'] = []
    }
    let el: HTMLCanvasElement
    try {
      el = this.canvas.toCanvasElement(mult, {
        left: ws.left * zoom + vpt[4],
        top: ws.top * zoom + vpt[5],
        width,
        height
      })
    } finally {
      if (eventListeners && savedRenderListeners) {
        eventListeners['after:render'] = savedRenderListeners
      }
    }
    // 先释放旧图;toBlob回调是异步的,若期间已有更新的截图写入,
    // 则丢弃本次结果并释放,防止旧图覆盖新图与blob泄漏
    const prevImage = target.image?.startsWith('blob:')
      ? target.image
      : undefined
    if (prevImage) {
      URL.revokeObjectURL(prevImage)
    }
    try {
      el.toBlob((blob: Blob | null) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        if (target.image !== prevImage) {
          URL.revokeObjectURL(url)
          return
        }
        target.image = url
      })
    } catch (error) {
      // 画布被污染(跨域图片未带CORS)等场景截图失败,忽略且不影响主流程
    }
  }

  destroy() {
    this.canvas.off('after:render', this.debouncedCapture)
    this.debouncedCapture.cancel()
  }
}
