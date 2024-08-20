<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-07-22 21:18:05
 * @LastEditors: June
 * @LastEditTime: 2024-07-24 19:37:27
 * @FilePath: /element-fabric-editor/src/components/History.vue
-->

<template>
  <div style="display: inline-block">
    <!-- 后退 -->
    <el-tooltip :content="$t('history.revocation') + `(${canUndo})`">
      <el-button @click="undo" link size="small" :disabled="!canUndo">
        <SvgIcon
          :style="{
            width: '20px',
            height: '20px',
            color: canUndo ? '#333' : '#ccc'
          }"
          name="ios-undo"
        />
      </el-button>
    </el-tooltip>

    <!-- 重做 -->
    <el-tooltip :content="$t('history.redo') + `(${canRedo})`">
      <el-button @click="redo" link size="small" :disabled="!canRedo">
        <SvgIcon
          :style="{
            width: '20px',
            height: '20px',
            color: canRedo ? '#333' : '#ccc'
          }"
          name="ios-redo"
        />
      </el-button>
    </el-tooltip>
  </div>
</template>

<script name="History" lang="ts" setup>
import useSelect from '@/hooks/select'

const { canvasEditor } = useSelect() as { canvasEditor: any }
const canUndo = ref(0)
const canRedo = ref(0)
// 后退
const undo = () => {
  canvasEditor.undo()
}
// 重做
const redo = () => {
  canvasEditor.redo()
}

onMounted(() => {
  canvasEditor.on('historyUpdate', (canUndoParam: number, canRedoParam: number) => {
    canUndo.value = canUndoParam
    canRedo.value = canRedoParam
  })
})
</script>

<style scoped lang="scss">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}

.time {
  color: #c1c1c1;
}
</style>
