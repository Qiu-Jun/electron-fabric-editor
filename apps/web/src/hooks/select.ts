/*
 * @Author: June
 * @Description: 画布选中状态 hook:模块级共享同一份选中状态,编辑器事件全局只绑定一次
 * @Date: 2024-07-25 14:39:41
 * @LastEditors: June
 * @LastEditTime: 2026-09-14 10:00:00
 * @FilePath: \element-fabric-editor\src\hooks\select.ts
 */
import Editor, { EventType } from '@/lib/core'
import { useI18n } from 'vue-i18n'
import { useEditorStoreWithOut } from '@/store/modules/editor'

const { SelectMode, SelectEvent } = EventType

// 共享选中状态,避免每个组件各自建状态、重复注册监听
const state = reactive({
  mSelectMode: SelectMode.EMPTY,
  mSelectOneType: '',
  mSelectId: '' as any, // 选择id
  mSelectIds: [] as any, // 选择id
  mSelectActive: [] as fabric.Object[]
})

const selectOne = (arr: fabric.Object[]) => {
  state.mSelectMode = SelectMode.ONE
  const [item] = arr
  if (item) {
    // markRaw 避免 fabric 对象被深层代理
    state.mSelectActive = [markRaw(item)]
    state.mSelectId = item.id
    state.mSelectOneType = item.type
    state.mSelectIds = [item.id]
  }
}

const selectMulti = (arr: fabric.Object[]) => {
  state.mSelectMode = SelectMode.MULTI
  state.mSelectId = ''
  state.mSelectIds = arr.map((item) => item.id)
}

const selectCancel = () => {
  state.mSelectId = ''
  state.mSelectIds = []
  state.mSelectMode = SelectMode.EMPTY
  state.mSelectOneType = ''
}

// 编辑器事件只在首次可用时绑定一次,常驻更新共享状态
let binded = false
const bindEditorEvents = () => {
  if (binded) return
  const editor = useEditorStoreWithOut().editor
  if (!editor) return
  binded = true
  editor.on(SelectEvent.ONE, selectOne)
  editor.on(SelectEvent.MULTI, selectMulti)
  editor.on(SelectEvent.CANCEL, selectCancel)
}

export default function useSelect(matchType?: Array<string>) {
  const { t } = useI18n()
  const editorStore = useEditorStoreWithOut()

  onMounted(() => {
    nextTick(bindEditorEvents)
  })

  let isMatchType
  if (matchType) {
    isMatchType = computed(() => matchType.includes(state.mSelectOneType))
  }
  const isOne = computed(() => state.mSelectMode === SelectMode.ONE)
  const isMultiple = computed(() => state.mSelectMode === SelectMode.MULTI)
  const isGroup = computed(
    () => state.mSelectMode === 'one' && state.mSelectOneType === 'group'
  )
  const isSelect = computed(() => state.mSelectMode)

  const selectType = computed(() => state.mSelectOneType)

  return {
    canvasEditor: editorStore.editor as Editor,
    mixinState: state,
    t,
    selectType,
    isSelect,
    isGroup,
    isOne,
    isMultiple,
    isMatchType
  }
}
