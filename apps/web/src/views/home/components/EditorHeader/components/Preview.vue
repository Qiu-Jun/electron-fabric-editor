<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2024-11-23 13:08:44
 * @LastEditors: June
-->
<template>
  <el-button link type="primary" @click="preview">
    {{ $t('editor.header.preview') }}
  </el-button>

  <el-image-viewer v-if="showImageViewer" :url-list="url" @close="close" />
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
const showImageViewer = ref(false)
const url: any = ref([])
const close = () => {
  showImageViewer.value = false
  url.value = []
}
const preview = () => {
  editorStore.editor.preview().then((dataUrl: string) => {
    url.value = [dataUrl]
    showImageViewer.value = true
  })
}
</script>
