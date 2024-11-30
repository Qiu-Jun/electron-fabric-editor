/*
 * @Author: June
 * @Description:
 * @Date: 2024-09-30 17:08:48
 * @LastEditTime: 2024-09-30 17:09:39
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\lib\core\objects\CustomRect.ts
 */
import { fabric } from 'fabric'

fabric.Rect = fabric.util.createClass(fabric.Rect, {
  type: 'rect',
  initialize: function (options: any) {
    options || (options = {})
    this.callSuper('initialize', options)
  },
  _render(ctx: any) {
    const roundValue = this.roundValue || 0
    this.rx = (1 / this.scaleX) * roundValue
    this.ry = (1 / this.scaleY) * roundValue
    this.callSuper('_render', ctx)
  }
})

fabric.Rect.fromObject = function (object, callback) {
  return fabric.Object._fromObject('Rect', object, callback)
}

export default fabric.Rect
