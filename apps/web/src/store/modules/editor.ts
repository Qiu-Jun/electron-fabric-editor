/*
 * @Author: June
 * @Description:
 * @Date: 2024-09-12 10:06:32
 * @LastEditTime: 2024-09-21 09:22:10
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\store\modules\editor.ts
 */
import { defineStore } from 'pinia'
import store from '@/store'
import { fabric } from 'fabric'
import { editorTabs, panels } from '@/enums/editor'

interface IState {
  editor: any
  canvas: fabric.Canvas | null
  zoom: number
  rulerEnable: boolean
  tabType: editorTabs
  panelType: panels
  showPanel: boolean
  panelPosition: 'left' | 'bottom'
}

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): IState => ({
    // markRaw 避免 fabric 实例被深层代理，消除全项目访问的响应式开销
    editor: null,
    canvas: null,
    zoom: 1, // 缩放比例
    rulerEnable: true, // 是否开启标尺
    tabType: editorTabs.template, // 左边栏
    panelType: panels.menu, // 面板类型
    showPanel: true, // 显示面板侧边栏
    panelPosition: 'left' // 面板侧栏位置
  }),
  actions: {
    setEditor(editor: any) {
      this.editor = markRaw(editor)
    },
    setCanvas(ctx: fabric.Canvas) {
      this.canvas = markRaw(ctx)
    },
    setScale(val: number) {
      this.zoom = val
    },
    updateRulerEnable(val: boolean) {
      this.rulerEnable = val
    },
    setTabType(tabType: editorTabs) {
      this.tabType = tabType
    },
    setPanelType(panelType: panels) {
      this.panelType = panelType
    },
    setShowPanel(val: boolean) {
      this.showPanel = val
    },
    setPanelPosition(pos: 'left' | 'bottom') {
      this.panelPosition = pos
    }
  }
})

// Need to be used outside the setup
export function useEditorStoreWithOut() {
  return useEditorStore(store)
}
