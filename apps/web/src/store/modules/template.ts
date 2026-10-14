/*
 * @Author: June
 * @Description: 页面(模板)状态管理,支持多页面切换与缩略图预览
 * @Date: 2024-09-30 17:20:34
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 16:40:00
 * @FilePath: \element-fabric-editor\src\store\modules\template.ts
 */
import { defineStore } from 'pinia'
import store from '@/store'
import { useEditorStoreWithOut } from '@/store/modules/editor'
import type { Template } from '@/types/template'

interface IState {
  templateList: Template[] // 所有的页面
  curTempIdx: number // 当前页面索引
  switching: boolean // 页面切换中,防止重入
}

export const useTemplateStore = defineStore({
  id: 'Template',
  state: (): IState => ({
    templateList: [],
    curTempIdx: -1,
    switching: false
  }),
  getters: {
    curTemplate: (state) => state.templateList[state.curTempIdx] as Template
  },
  actions: {
    // 追加页面(导入流程/初始页),纯状态操作不改动画布
    addTemplate(template: Template | Template[]) {
      const templates = Array.isArray(template) ? template : [template]
      const addIndex = this.curTempIdx + 1
      this.curTempIdx = addIndex
      this.templateList = this.templateList.concat(templates)
      // 画布内容即为新页内容,立即截一张初始缩略图
      useEditorStoreWithOut().editor?.capturePreview?.()
    },

    // 导入内容落到当前页(替换),仅手动"+"才新增页面,避免自动追加产生多余空白页
    applyToCurrent(template: Template) {
      const cur = this.templateList[this.curTempIdx]
      if (cur?.image?.startsWith('blob:')) {
        URL.revokeObjectURL(cur.image)
      }
      if (cur) {
        this.templateList[this.curTempIdx] = template
      } else {
        this.templateList = [template]
        this.curTempIdx = 0
      }
    },

    // 把当前画布序列化写回当前页面
    saveCurrentPage() {
      const tpl = this.templateList[this.curTempIdx]
      const editor = useEditorStoreWithOut().editor
      if (!tpl || !editor) return
      const json = editor.getJson()
      const ws = json.objects?.find((o: any) => o.id === 'workspace')
      tpl.json = JSON.stringify(json)
      if (ws) {
        tpl.width = ws.width
        tpl.height = ws.height
      }
      // 画布还是当前页时立刻截图,缩略图不会写错页面
      editor.capturePreview?.(tpl)
    },

    // 切换页面:先保存当前页,再加载目标页
    switchTemplate(idx: number) {
      if (this.switching || idx === this.curTempIdx) return
      const target = this.templateList[idx]
      if (!target) return
      this.switching = true
      try {
        this.saveCurrentPage()
        const editor = useEditorStoreWithOut().editor
        editor.loadJSON(
          target.json,
          () => {
            this.curTempIdx = idx
            this.switching = false
          },
          { addToTemplate: false }
        )
      } catch (e) {
        this.switching = false
        throw e
      }
    },

    // 新建空白页:保存当前页后加载空白内容
    newTemplate(blank: Template) {
      if (this.switching) return
      this.switching = true
      try {
        this.saveCurrentPage()
        this.templateList.push(blank)
        const idx = this.templateList.length - 1
        const editor = useEditorStoreWithOut().editor
        editor.loadJSON(
          blank.json,
          () => {
            this.curTempIdx = idx
            this.switching = false
          },
          { addToTemplate: false }
        )
      } catch (e) {
        this.switching = false
        throw e
      }
    },

    // 删除页面
    deleteTemplate(idx: number) {
      const len = this.templateList.length
      if (len === 1) return ElMessage.warning('删除失败，至少要有一个模板')
      const removed = this.templateList[idx]
      if (removed?.image?.startsWith('blob:')) {
        URL.revokeObjectURL(removed.image)
      }
      this.templateList.splice(idx, 1)
      if (idx === this.curTempIdx) {
        // 删除当前页:先摘掉索引再切换到上一个页面
        this.curTempIdx = -1
        this.switchTemplate(Math.max(0, idx - 1))
      } else if (idx < this.curTempIdx) {
        this.curTempIdx--
      }
    },

    // 离开编辑器时释放所有页面缩略图的blob URL并清空列表
    resetTemplate() {
      this.templateList.forEach((tpl) => {
        if (tpl.image?.startsWith('blob:')) {
          URL.revokeObjectURL(tpl.image)
        }
      })
      this.templateList = []
      this.curTempIdx = -1
      this.switching = false
    }
  }
})

export function useTemplateStoreWithOut() {
  return useTemplateStore(store)
}
