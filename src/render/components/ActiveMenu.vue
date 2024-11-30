<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-04 11:56:54
 * @LastEditTime: 2024-10-03 11:56:54
 * @LastEditors: June
 * @FilePath: \ai-desing\src\views\editor\components\activeMenu.vue
-->
<template>
  <ul
    class="box-border px-10px absolute inline-block h-36px bg-#fff shadow z-99 rounded-4px flex justify-start items-center last:mr-0"
    :style="{
      left: `${state.left}px`,
      top: `${state.top}px`,
      visibility: state.visible
    }"
  >
    <li class="mr-10px f-center cursor-pointer" @click="handleCopy">
      <SvgIcon color="#333" extClass="text-24px text-#333" icon="copy" />
    </li>
    <li class="mr-10px f-center cursor-pointer" @click="handleDelete">
      <SvgIcon extClass="text-24px text-#333" icon="delete" />
    </li>
    <!-- <li class="mr-10px f-center cursor-pointer">
      <SvgIcon
        :style="{ width: '24px', height: '24px' }"
        color="#333"
        name="more"
      />
    </li> -->
  </ul>
</template>

<script lang="ts" setup>
import { throttle, debounce } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
const state = reactive({
  left: 0,
  top: 0,
  visible: 'hidden'
})

const initMenu = throttle(function (e: any) {
  // 这里加nextTick是因为源代码添加后实现居住那个，导致坐标不是中间的
  nextTick(() => {
    const oCoords = e?.target?.oCoords || e.selected[0].oCoords
    if (oCoords) {
      state.visible === 'hidden' && (state.visible = 'visible')
      state.left = oCoords.tl.x
      state.top = oCoords.tl.y - 44
    }
  })
}, 150)

const hiddenView = () => {
  state.visible = 'hidden'
}

const handleCopy = debounce(function () {
  editorStore.editor.clone()
}, 250)

const handleDelete = debounce(function () {
  editorStore.editor.del()
}, 250)

onMounted(() => {
  nextTick(() => {
    editorStore.canvas?.on('object:moving', initMenu)
    editorStore.canvas?.on('object:modified', initMenu)
    editorStore.canvas?.on('selection:cleared', hiddenView)
    editorStore.canvas?.on('object:added', initMenu)
    editorStore.canvas?.on('selection:created', initMenu)
  })
})

onBeforeUnmount(() => {
  nextTick(() => {
    editorStore.canvas?.off('object:moving', initMenu)
    editorStore.canvas?.off('object:modified', initMenu)
    editorStore.canvas?.off('selection:cleared', hiddenView)
    editorStore.canvas?.off('object:added', initMenu)
    editorStore.canvas?.off('selection:created', initMenu)
  })
})
</script>

<style lang="scss" scoped>
.shadow {
  box-shadow:
    0px 0px 1px 0px rgba(0, 0, 0, 0.35),
    0px 8px 32px 2px rgba(0, 0, 0, 0.1);
}
</style>
