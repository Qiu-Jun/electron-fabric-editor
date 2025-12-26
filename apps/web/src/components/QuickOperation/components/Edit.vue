<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-06 00:14:35
 * @LastEditTime: 2024-11-28 14:24:37
 * @LastEditors: June
 * @FilePath: \ai-desing\src\views\editor\components\Edit.vue
-->
<template>
  <el-tooltip
    :content="$t('editor.quickOperation.editPoly')"
    v-if="isMatchType"
  >
    <el-button @click="onEditPolygon" link>
      <SvgIcon extClass="text-20px" icon="editor-brush" />
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isMatchType } = useSelect(['polygon'])
const onEditPolygon = () => {
  const obj = editorStore.editor.fabricCanvas?.getActiveObject()
  if (obj && obj.type === 'polygon') {
    editorStore.editor.activeEdit()
  } else {
    ElMessage.warning('请检查选择polygon')
  }
}
</script>
