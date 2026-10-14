/*
 * @Author: June
 * @Description: 细尾箭头元素类型声明（实现在 ThinTailArrow.js）
 * @Date: 2026-09-04 10:00:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 10:00:00
 * @FilePath: /element-fabric-editor/src/lib/core/objects/ThinTailArrow.d.ts
 */
import type { fabric } from 'fabric'

declare class ThinTailArrow extends fabric.Line {
  type: string
  superType: string
  constructor(points?: number[], options?: Record<string, any>)
  static fromObject(
    options: Record<string, any>,
    callback: (arrow: ThinTailArrow) => void
  ): void
}

export default ThinTailArrow
