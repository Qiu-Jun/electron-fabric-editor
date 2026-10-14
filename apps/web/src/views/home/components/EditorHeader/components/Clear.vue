<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-09-12 20:07:29
 * @LastEditTime: 2024-11-23 13:12:53
 * @LastEditors: June
-->
<template>
  <el-button link type="primary" @click="handleClear">
    {{ $t('editor.header.clear') }}
  </el-button>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()

const handleClear = debounce(function () {
  const objs = editorStore.canvas?.getObjects()
  // @ts-ignore
  if (!objs || (objs.length === 1 && objs[0]?.id === 'workspace'))
    return ElMessage.warning('画布无内容')

  ElMessageBox.confirm('您确定清空画布吗?', 'Warning', {
    title: '提示',
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    editorStore.editor?.clear()
    // 重置历史栈为当前状态
    editorStore.editor?.clearAndSaveState()
  })
}, 250)
</script>
