/*
 * @Author: June
 * @Description: Description
 * @Date: 2024-10-20 13:25:44
 * @LastEditTime: 2024-10-20 13:29:39
 * @LastEditors: June
 */
import { useTemplateStoreWithOut } from '@/store/modules/template'
import { useEditorStoreWithOut } from '@/store/modules/editor'

const templateStore = useTemplateStoreWithOut()
const editorStore = useEditorStoreWithOut()

export function useTemplate2bolb() {
  const template2bolb = () => {
    const list = templateStore.templateList
    const curIdx = templateStore.curTempIdx
    const curTemplate = list[curIdx]
    if (!curTemplate) return
    if (curTemplate.image && curTemplate.image.startsWith('blob:')) {
      URL.revokeObjectURL(curTemplate.image)
      editorStore.canvas?.toCanvasElement(10).toBlob((blob) => {
        if (blob) {
          curTemplate.image = URL.createObjectURL(blob)
        }
      })
    } else {
      editorStore.canvas?.toCanvasElement(10).toBlob((blob) => {
        if (blob) {
          curTemplate.image = URL.createObjectURL(blob)
        }
      })
    }
  }

  return {
    template2bolb
  }
}
