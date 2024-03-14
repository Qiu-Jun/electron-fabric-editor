<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-14 13:47:42
 * @Description: 回退重做
-->
<template>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${canUndo})`">
      <Button @click="undo" type="text" size="small" :disabled="!canUndo">
        <Icon type="ios-undo" size="20" />
      </Button>
    </Tooltip>

    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${canRedo})`">
      <Button @click="redo" type="text" size="small" :disabled="!canRedo">
        <Icon type="ios-redo" size="20" />
      </Button>
    </Tooltip>
    <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
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

<style scoped lang="less">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}

.time {
  color: #c1c1c1;
}
</style>
