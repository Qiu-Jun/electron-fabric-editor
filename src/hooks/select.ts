/*
 * @Descripttion: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-09 13:35:58
 */
import { inject, onBeforeMount, onMounted, reactive } from 'vue'
import { SelectEvent, SelectMode, SelectOneType } from '@/utils/event/types'

interface Selector {
  mSelectMode: SelectMode
  mSelectOneType: SelectOneType
  mSelectId: string[] | ''
  mSelectIds: string[]
  mSelectActive: unknown[]
}

export default function useSelect() {
  const state = reactive<Selector>({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: SelectOneType.EMPTY,
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: []
  })

  const fabric = inject('fabric')
  // const canvas = inject('canvas');
  const canvasEditor: any = inject('canvasEditor')
  const event: any = inject('event')

  const selectOne = (e: any) => {
    state.mSelectMode = SelectMode.ONE
    state.mSelectId = e[0].id
    state.mSelectOneType = e[0].type
    state.mSelectIds = e.map((item: any) => item.id)
  }

  const selectMulti = (e: any) => {
    state.mSelectMode = SelectMode.MULTI
    state.mSelectId = ''
    state.mSelectIds = e.map((item: any) => item.id)
  }

  const selectCancel = () => {
    state.mSelectId = ''
    state.mSelectIds = []
    state.mSelectMode = SelectMode.EMPTY
    state.mSelectOneType = SelectOneType.EMPTY
  }

  onMounted(() => {
    event.on(SelectEvent.ONE, selectOne)
    event.on(SelectEvent.MULTI, selectMulti)
    event.on(SelectEvent.CANCEL, selectCancel)
  })

  onBeforeMount(() => {
    event.off(SelectEvent.ONE, selectOne)
    event.off(SelectEvent.MULTI, selectMulti)
    event.off(SelectEvent.CANCEL, selectCancel)
  })

  return {
    fabric,
    // canvas,
    canvasEditor,
    mixinState: state
  }
}
