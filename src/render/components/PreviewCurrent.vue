<template>
  <el-button link type="primary" @click="preview">
    {{ $t('preview') }}
  </el-button>

  <el-image-viewer v-if="showImageViewer" :url-list="url" @close="close" />
</template>

<script lang="ts" setup>
const showImageViewer = ref(false)
const canvasEditor: any = inject('canvasEditor')
const url = ref([])
const close = () => {
  showImageViewer.value = false
  url.value = []
}
const preview = () => {
  canvasEditor.preview().then((dataUrl: string) => {
    url.value = [dataUrl]
    showImageViewer.value = true
  })
}
</script>
