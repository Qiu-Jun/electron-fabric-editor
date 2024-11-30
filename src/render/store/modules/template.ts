/*
 * @Author: June
 * @Description:
 * @Date: 2024-09-30 17:20:34
 * @LastEditTime: 2024-11-22 14:55:35
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\store\modules\template.ts
 */
import { defineStore } from 'pinia'
import store from '@/store'
import { isUrl, src2blob } from '@/utils/common'
import { useEditorStoreWithOut } from '@/store/modules/editor'
import type { Template } from '@/types/template'
interface IState {
  templateList: Template[] // 所有的模板
  curTempIdx: number // 当前页面索引
}

const editorStore = useEditorStoreWithOut()
export const useTemplateStore = defineStore({
  id: 'Template',
  state: (): IState => ({
    templateList: [],
    curTempIdx: -1
  }),
  getters: {
    curTemplate: (state) => state.templateList[state.curTempIdx] as Template
  },
  actions: {
    // 设置当前模板的下标
    setTemplateIndex(index: number) {
      this.curTempIdx = index
    },

    // 添加模板
    addTemplate(template: Template | Template[]) {
      const templates = Array.isArray(template) ? template : [template]
      const addIndex = this.curTempIdx + 1
      this.curTempIdx = addIndex
      this.templateList = this.templateList.concat(templates)

      this.renderTemplate()
      console.log('新的模板列表', this.templateList)
    },

    // 渲染模板
    async renderTemplate() {
      const canvas = editorStore.canvas
      if (!canvas) return
      console.log(this.curTemplate, '3333444')
      // this.curTemplate && (await canvas.loadFromJSON(this.curTemplate))
    },

    // 更新模板
    updateTemplate(props: Partial<Template>) {
      const templateIdx = this.curTempIdx
      this.templateList[templateIdx] = {
        ...this.templateList[templateIdx],
        ...props
      }
    },

    async setTemplatePreview(src: string) {
      if (!isUrl(src)) {
        src = `${window.location.origin}/${src}`
      }
      const blob = await src2blob(src)
      if (!blob) return
      this.templateList[this.curTempIdx].preview = blob
    },

    // 删除模板
    deleteTemplate(idx: number) {
      const len = this.templateList.length
      if (len == 1) return ElMessage.warning('删除失败，至少要有一个模板')
      this.templateList.splice(idx, 1)
      if (len > idx) {
        const newIdx = this.curTempIdx - 1
        this.curTempIdx = newIdx <= 0 ? 0 : newIdx
      }
      this.renderTemplate()
    },

    // 清空模板
    clearTemplate() {
      const objects = this.templateList[this.curTempIdx].objects.filter(
        (item) => item.id === 'workspace'
      )
      this.templateList[this.curTempIdx].objects = objects
      this.renderTemplate()
    }
  }
})

export function useTemplateStoreWithOut() {
  return useTemplateStore(store)
}
