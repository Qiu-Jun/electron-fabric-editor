<template>
  <div class="box">
    <el-switch
      size="large"
      v-model="status"
      @change="switchMode"
      width="60"
      inline-prompt
      active-text="Drag"
      inactive-text="Drag"
    />
  </div>
</template>

<script setup name="Drag">
import useSelect from '@/hooks/select'
const status = ref(false)
const { canvasEditor } = useSelect()

const switchMode = (val) => {
  if (val) {
    canvasEditor.startDring()
  } else {
    canvasEditor.endDring()
  }
}

onMounted(() => {
  canvasEditor.on('startDring', () => (status.value = true))
  canvasEditor.on('endDring', () => (status.value = false))
})

onBeforeUnmount(() => {
  canvasEditor.off('startDring')
  canvasEditor.off('endDring')
})
</script>
<style scoped lang="scss">
.box {
  position: absolute;
  right: 200px;
  bottom: 6px;
}
</style>
