/*
 * @Author: June
 * @Description: Description,
 * @Date: 2024-11-22 13:22:25
 * @LastEditTime: 2024-11-22 13:53:31
 * @LastEditors: June
 */
import { v4 as uuid } from 'uuid'
import { fabric } from 'fabric'
import { useEditorStoreWithOut } from '@/store/modules/editor'
import type { Template } from '@/types/template'

const editorStore = useEditorStoreWithOut()
export function useTemplate() {
  const zoom = editorStore.editor.getScale()
  const { width, height } = editorStore.editor.getWorkspaceSize() || {
    width: 0,
    height: 0
  }
  const createTemplate = (): Template => ({
    id: uuid(),
    version: fabric.version,
    width,
    height,
    zoom,
    objects: editorStore.canvas?.getObjects() || []
  })

  return {
    createTemplate
  }
}
