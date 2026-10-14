/*
 * @Author: June
 * @Description: 页面创建工具
 * @Date: 2024-11-22 13:22:25
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 16:45:00
 * @FilePath: \element-fabric-editor\src\hooks\useTemplate.ts
 */
import { v4 as uuid } from 'uuid'
import { fabric } from 'fabric'
import { useEditorStoreWithOut } from '@/store/modules/editor'
import type { Template } from '@/types/template'

export function useTemplate() {
  // 在函数内取 store，避免 import 时提前初始化
  const editorStore = useEditorStoreWithOut()
  // 新建空白页:只保留画板矩形,尺寸与当前画板一致
  const createTemplate = (): Template => {
    const json = editorStore.editor.getJson()
    const ws = json.objects?.find((o: any) => o.id === 'workspace')
    return {
      id: uuid(),
      version: fabric.version,
      zoom: editorStore.editor.getScale(),
      width: ws?.width ?? 0,
      height: ws?.height ?? 0,
      json: JSON.stringify({
        version: fabric.version,
        objects: ws ? [ws] : [],
        background: '#ffffff'
      })
    }
  }

  return {
    createTemplate
  }
}
