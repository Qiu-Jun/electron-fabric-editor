/*
 * @Author: June
 * @Description: 箭头元素类型声明（实现在 Arrow.js）
 * @Date: 2026-09-04 10:00:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 10:00:00
 * @FilePath: /element-fabric-editor/src/lib/core/objects/Arrow.d.ts
 */
import type { fabric } from 'fabric'

declare class Arrow extends fabric.Line {
  type: string
  superType: string
  constructor(points?: number[], options?: Record<string, any>)
  static fromObject(
    options: Record<string, any>,
    callback: (arrow: Arrow) => void
  ): void
}

export default Arrow
