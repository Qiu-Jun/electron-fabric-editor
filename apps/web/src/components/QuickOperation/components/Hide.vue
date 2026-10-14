<!--
 * @Author: June
 * @Description: 隐藏快捷操作
 * @Date: 2024-09-05 23:18:42
 * @LastEditTime: 2026-09-14 10:30:00
 * @LastEditors: June
-->
<template>
  <el-button text :content="$t('editor.quickOperation.hidden')" v-if="isOne">
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
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()
const { isOne } = useAttrPanel({
  // 回显隐藏状态
  getAttrs: (activeObject: any) => {
    isHide.value = activeObject.visible === false
  }
})

const isHide = ref(false)

const doHide = (hide: boolean) => {
  // 修改visible属性
  const activeObject: any = editorStore.canvas?.getActiveObject()
  activeObject.set('visible', !hide)
  editorStore.canvas?.requestRenderAll()
  isHide.value = hide
}
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  border: none;
  background-color: transparent;
}
</style>
