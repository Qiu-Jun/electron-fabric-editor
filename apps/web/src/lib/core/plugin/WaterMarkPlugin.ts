/*
 * @Author: June
 * @Description: 画布水印插件：在画板区域叠加文字水印（单角/平铺），支持随画布尺寸自动重绘
 * @Date: 2024-04-21 08:30:48
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 18:30:00
 */
import { fabric } from 'fabric'
import { debounce } from 'lodash-es'
import type { DebouncedFunc } from 'lodash-es'
import Editor from '../Editor'

// 水印位置（枚举值仅为内部标识）
enum POSITION {
  lt = 'Left_Top',
  lb = 'Left_Bottom',
  rt = 'Right_Top',
  rb = 'Right_Bottom',
  full = 'Full'
}

type IEditor = Editor
type IPosition = POSITION
interface IDrawOps {
  text: string
  size: number
  fontFamily: string
  color: string
  isRotate: boolean
  position: IPosition
}

const defaultOptions: IDrawOps = {
  text: '',
  size: 24,
  isRotate: false, // 平铺时是否倾斜
  fontFamily: '汉体', // 本地兜底字体，由 FontPlugin 动态注册
  color: '#ccc',
  position: POSITION.lt
}

class WaterMarkPlugin implements IPluginTempl {
  static pluginName = 'WaterMarkPlugin'
  static apis = ['drawWaterMark', 'clearWaterMark', 'updateDrawStatus']
  private hadDraw = false
  private drawOps: IDrawOps = { ...defaultOptions }
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {
    this.init()
  }

  // 绘制水印并叠加到画板区域（等待字体就绪后再绘制）
  async drawWaterMark(ops?: Partial<IDrawOps>) {
    this.drawOps = { ...this.drawOps, ...ops }
    if (!this.drawOps.text) return
    const workspace = this.canvas
      .getObjects()
      .find((item: any) => item.id === 'workspace')
    if (!workspace) return
    try {
      // 等待水印字体加载完成，避免回退字体被固化进图片
      await document.fonts.load(
        `${this.drawOps.size}px ${this.drawOps.fontFamily}`
      )
    } catch (error) {
      // 字体加载失败时继续用当前可用字体绘制
    }
    const { width, height, left, top } = workspace as any
    const imgString = this.renderWaterMarkDataURL(width, height)
    this.hadDraw = true
    this.canvas.overlayImage = undefined
    this.canvas.setOverlayImage(
      imgString,
      this.canvas.renderAll.bind(this.canvas),
      {
        left: left || 0,
        top: top || 0,
        originX: 'left',
        originY: 'top'
      }
    )
  }

  // 生成水印图：四角按坐标绘制，平铺模式用 pattern 重复填充
  private renderWaterMarkDataURL(width: number, height: number): string {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    const { color, size, fontFamily, text, position } = this.drawOps
    ctx.fillStyle = color
    ctx.font = `${size}px ${fontFamily}`
    const margin = 10
    if (position === POSITION.full) {
      const tile = this.createTileCanvas()
      ctx.fillStyle = ctx.createPattern(tile, 'repeat')!
      ctx.fillRect(0, 0, width, height)
    } else {
      const textWidth = ctx.measureText(text).width
      const isLeft = position === POSITION.lt || position === POSITION.lb
      const isTop = position === POSITION.lt || position === POSITION.rt
      const x = isLeft ? margin : width - textWidth - margin
      const y = isTop ? size + margin : height - margin
      ctx.fillText(text, x, y, width - margin * 2)
    }
    return canvas.toDataURL()
  }

  // 生成平铺用的小块画布（可倾斜 -30°）
  private createTileCanvas(): HTMLCanvasElement {
    const { size, fontFamily, text, color, isRotate } = this.drawOps
    const angle = -30
    const rad = (angle * Math.PI) / 180
    const pad = 20
    const textWidth = this.measureTextWidth(text, size, fontFamily) + pad
    const tile = document.createElement('canvas')
    tile.width = isRotate
      ? textWidth * Math.abs(Math.cos(rad)) + size
      : textWidth
    tile.height = isRotate
      ? textWidth * Math.abs(Math.sin(rad)) + size
      : size + pad
    const ctx = tile.getContext('2d')!
    ctx.font = `${size}px ${fontFamily}`
    ctx.fillStyle = color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    if (isRotate) {
      ctx.translate(0, textWidth * Math.abs(Math.sin(rad)))
      ctx.rotate(rad)
      ctx.fillText(text, 0, 0)
    } else {
      ctx.fillText(text, pad / 2, pad / 2)
    }
    return tile
  }

  private measureTextWidth(
    text: string,
    size: number,
    fontFamily: string
  ): number {
    const ctx = document.createElement('canvas').getContext('2d')!
    ctx.font = `${size}px ${fontFamily}`
    return ctx.measureText(text).width
  }

  // 画布尺寸变化时按当前配置重绘（防抖，忽略事件参数）
  private refresh: DebouncedFunc<() => void> = debounce(() => {
    if (this.hadDraw) this.drawWaterMark()
  }, 250)

  // 更新 hadDraw；导入 json 时无法知道是否已绘制
  updateDrawStatus(status: boolean) {
    this.hadDraw = status
  }

  clearWaterMark() {
    if (!this.hadDraw) return
    this.canvas.overlayImage = undefined
    this.canvas.renderAll()
    this.hadDraw = false
    this.drawOps = { ...defaultOptions }
  }

  init() {
    // 保存同一引用，保证 destroy 能正确解绑
    this.editor.on('sizeChange', this.refresh)
  }

  destroy() {
    this.editor.off('sizeChange', this.refresh)
    this.refresh.cancel()
  }
}

export default WaterMarkPlugin
