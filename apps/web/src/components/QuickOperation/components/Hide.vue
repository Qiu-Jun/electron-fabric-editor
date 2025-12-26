<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-05 23:18:42
 * @LastEditTime: 2024-11-28 14:24:54
 * @LastEditors: June
 * @FilePath: \ai-desing\src\views\editor\components\Hide.vue
-->
<template>
  <el-button text :content="$t('editor.quickOperation.hide')" v-if="isOne">
    <el-button
      v-if="isHide"
      @click="doHide(false)"
      :icon="Hide"
      link
    ></el-button>
    <el-button v-else @click="doHide(true)" :icon="View" link></el-button>
  </el-button>
</template>

<script lang="ts" setup>
import { View, Hide } from '@element-plus/icons-vue'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne } = useSelect()
const isHide = ref(false)

const doHide = (hide: any) => {
  // 修改visible属性
  const activeObject: any = editorStore.canvas?.getActiveObject()
  activeObject.set('visible', !hide)
  editorStore.canvas?.requestRenderAll()
  isHide.value = hide
}

const handleSelected = () => {
  const activeObject = editorStore.canvas?.getActiveObject()
  // @ts-ignore
  isHide.value = !activeObject.visible
}

onMounted(() => {
  editorStore.editor?.on('selectOne', handleSelected)
})

onBeforeUnmount(() => {
  editorStore.editor?.off('selectOne', handleSelected)
})
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  border: none;
  background-color: transparent;
}
</style>
