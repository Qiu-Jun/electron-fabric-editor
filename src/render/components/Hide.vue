<template>
  <el-button text :content="$t('quick.hide')" v-if="mixinState.mSelectMode === 'one'">
    <el-button v-if="isHide" @click="doHide(false)" :icon="Hide" link></el-button>
    <el-button v-else @click="doHide(true)" :icon="View" link></el-button>
  </el-button>
</template>

<script setup name="Hide">
import useSelect from '@/hooks/select'
import { View, Hide } from '@element-plus/icons-vue'

const { mixinState, canvasEditor } = useSelect()
const isHide = ref(false)

const doHide = (hide) => {
  // 修改visible属性
  const activeObject = canvasEditor.canvas.getActiveObject()
  activeObject.set('visible', !hide)
  canvasEditor.canvas.requestRenderAll()
  isHide.value = hide
}

const handleSelected = () => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  isHide.value = !activeObject.visible
}

onMounted(() => {
  canvasEditor.on('selectOne', handleSelected)
})

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', handleSelected)
})
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  border: none;
  background-color: transparent;
}
</style>
