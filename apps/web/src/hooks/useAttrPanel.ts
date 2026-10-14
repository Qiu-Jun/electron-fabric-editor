/*
 * @Author: June
 * @Description: 右侧属性面板通用逻辑:选中对象变化时回显属性,统一监听生命周期
 * @Date: 2026-09-14 10:05:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-14 10:05:00
 * @FilePath: \element-fabric-editor\src\hooks\useAttrPanel.ts
 */
import { EventType } from '@/lib/core'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from './select'

const { SelectEvent } = EventType

interface IOptions {
  // 面板适用的元素类型,不传表示任意单选元素
  matchTypes?: string[]
  // 选中对象变化时回显面板属性
  getAttrs: (activeObject: fabric.Object) => void
}

export default function useAttrPanel(options: IOptions) {
  const editorStore = useEditorStore()
  const select = useSelect(options.matchTypes)

  // 属性回显:画布修改事件可能来自其他对象,非当前选中对象时跳过
  const handler = (e?: any) => {
    const activeObject = editorStore.canvas?.getActiveObject()
    if (e && e.target && e.target !== activeObject) return
    if (activeObject) {
      options.getAttrs(activeObject)
    }
  }

  // 通用属性修改:设置键值并重绘
  const changeCommon = (key: string, value: any) => {
    const activeObject = editorStore.canvas?.getActiveObjects()[0]
    if (activeObject) {
      activeObject.set(key, value)
      editorStore.canvas?.renderAll()
    }
  }

  onMounted(() => {
    nextTick(() => {
      handler()
      editorStore.editor?.on(SelectEvent.ONE, handler)
      editorStore.canvas?.on('object:modified', handler)
    })
  })

  onBeforeUnmount(() => {
    editorStore.editor?.off(SelectEvent.ONE, handler)
    editorStore.canvas?.off('object:modified', handler)
  })

  return { ...select, changeCommon }
}
