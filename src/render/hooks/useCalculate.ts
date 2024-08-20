import { inject } from 'vue'

export default function useCalculate() {
  const canvasEditor: any = inject('canvasEditor')

  // 获取画布的DOMRect对象
  const getCanvasBound = () => canvasEditor.canvas.getSelectionElement().getBoundingClientRect()

  // 判断拖拽结束的坐标是否在画布外
  const isOutsideCanvas = (x, y) => {
    const { left, right, top, bottom } = getCanvasBound()
    return x < left || x > right || y < top || y > bottom
  }

  return {
    getCanvasBound,
    isOutsideCanvas
  }
}
