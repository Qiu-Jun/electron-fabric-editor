<template>
  <el-tooltip :content="$t('quick.editPoly')" v-if="mixinState.mSelectOneType === 'polygon'">
    <el-button @click="onEditPolygon" link>
      <SvgIcon :style="{ width: '20px', height: '20px' }" name="editor-brush" />
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import useSelect from '@/hooks/select'
import { ElMessage } from 'element-plus'

const { mixinState, canvasEditor } = useSelect()
const onEditPolygon = () => {
  const obj = canvasEditor.fabricCanvas?.getActiveObject()
  if (obj && obj.type === 'polygon') {
    canvasEditor.activeEdit()
  } else {
    ElMessage.warning('请检查选择polygon')
  }
}
</script>
