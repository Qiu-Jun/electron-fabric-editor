/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2024-09-13 00:47:01
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\hooks\useCalculate.ts
 */
import { useEditorStoreWithOut } from '@/store/modules/editor'

const editorStore = useEditorStoreWithOut()
export default function useCalculate() {
  // 获取画布的DOMRect对象
  const getCanvasBound = () =>
    editorStore.canvas?.getSelectionElement().getBoundingClientRect()

  // 判断拖拽结束的坐标是否在画布外
  const isOutsideCanvas = (x: number, y: number) => {
    const { left, right, top, bottom } = getCanvasBound() as any
    return x < left || x > right || y < top || y > bottom
  }

  return {
    getCanvasBound,
    isOutsideCanvas
  }
}
