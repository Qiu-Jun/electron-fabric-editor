/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-25 14:39:41
 * @LastEditTime: 2024-10-20 15:43:56
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\hooks\select.ts
 */
import Editor, { EventType } from '@/lib/core'
import { useI18n } from 'vue-i18n'
import { useEditorStoreWithOut } from '@/store/modules/editor'

const { SelectMode, SelectEvent } = EventType
const editorStore = useEditorStoreWithOut()

export default function useSelect(matchType?: Array<string>) {
  const { t } = useI18n()

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
      state.mSelectActive = [item]
      state.mSelectId = item.id
      state.mSelectOneType = item.type
      state.mSelectIds = [item.id]
    }
    callBack()
  }

  const selectMulti = (arr: fabric.Object[]) => {
    state.mSelectMode = SelectMode.MULTI
    state.mSelectId = ''
    state.mSelectIds = arr.map((item) => item.id)
    callBack()
  }

  const selectCancel = () => {
    state.mSelectId = ''
    state.mSelectIds = []
    state.mSelectMode = SelectMode.EMPTY
    state.mSelectOneType = ''
    callBack()
  }

  let callBack = () => {
    //
  }
  const getObjectAttr = (cb: any) => {
    callBack = cb
  }
  onMounted(() => {
    nextTick(() => {
      editorStore.editor?.on(SelectEvent.ONE, selectOne)
      editorStore.editor?.on(SelectEvent.MULTI, selectMulti)
      editorStore.editor?.on(SelectEvent.CANCEL, selectCancel)
    })
  })

  onBeforeMount(() => {
    editorStore.editor?.off(SelectEvent.ONE, selectOne)
    editorStore.editor?.off(SelectEvent.MULTI, selectMulti)
    editorStore.editor?.off(SelectEvent.CANCEL, selectCancel)
  })

  let isMatchType
  if (matchType) {
    isMatchType = computed(() => matchType.includes(state.mSelectOneType))
  }
  const isOne = computed(() => state.mSelectMode === 'one')
  const isMultiple = computed(() => state.mSelectMode === 'multiple')
  const isGroup = computed(
    () => state.mSelectMode === 'one' && state.mSelectOneType === 'group'
  )
  const isSelect = computed(() => state.mSelectMode)

  const selectType = computed(() => state.mSelectOneType)

  const matchTypeHander = (types: string[]) => {
    return computed(() => types.includes(state.mSelectOneType))
  }

  return {
    canvasEditor: editorStore.editor as Editor,
    mixinState: state,
    t,
    selectType,
    isSelect,
    isGroup,
    isOne,
    isMultiple,
    isMatchType,
    matchTypeHander,
    getObjectAttr
  }
}
