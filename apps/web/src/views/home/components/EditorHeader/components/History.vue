<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-07-22 21:18:05
 * @LastEditors: June
 * @LastEditTime: 2024-11-23 13:39:22
 * @FilePath: \ai-desing\src\views\editor\components\History.vue
-->

<template>
  <div class="inline-block">
    <!-- 后退 -->
    <el-tooltip :content="$t('editor.header.history.undo') + `(${canUndo})`">
      <el-button @click="undo" link size="small" :disabled="!canUndo">
        <SvgIcon
          extClass="text-20px"
          :color="canUndo ? '#333' : '#ccc'"
          icon="ios-undo"
        />
      </el-button>
    </el-tooltip>

    <!-- 重做 -->
    <el-tooltip :content="$t('editor.header.history.redo') + `(${canRedo})`">
      <el-button @click="redo" link size="small" :disabled="!canRedo">
        <SvgIcon
          extClass="text-20px"
          :color="canRedo ? '#333' : '#ccc'"
          icon="ios-redo"
        />
      </el-button>
    </el-tooltip>
  </div>
</template>

<script name="History" lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
const canUndo = ref(0)
const canRedo = ref(0)
// 后退
const undo = () => {
  editorStore.editor.header.undo()
}
// 重做
const redo = () => {
  editorStore.editor.header.redo()
}

onMounted(() => {
  nextTick(() => {
    editorStore.editor?.on(
      'historyUpdate',
      (canUndoParam: any, canRedoParam: any) => {
        canUndo.value = canUndoParam
        canRedo.value = canRedoParam
      }
    )
  })
})
</script>
