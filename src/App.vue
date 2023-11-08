<!--
 * @Author: June
 * @Description:
 * @Date: 2023-10-29 12:18:14
 * @LastEditors: June
 * @LastEditTime: 2023-11-08 11:37:48
-->
<template>
  <div id="app">
    <router-view />

    <Modal v-model="showUpdateModal" title="更新" okText="立即更新" @on-ok="onConfirm">
      <p>进度{{ modelText }}</p>
    </Modal>
  </div>
</template>

<script name="App" lang="ts" setup>
import { Modal } from 'view-ui-plus'
const showUpdateModal = ref(false)
const modelText = ref('')
const onConfirm = () => {
  window.nativeBridge.ipcRenderer.send('doanloadNewVersion')
}

onMounted(() => {
  window?.nativeBridge?.onAppUpdateMsg((updateObj: { type: string; text: string }) => {
    const { type, text } = updateObj
    if (type === 'needUpdate') {
      Modal.confirm({
        title: '提示',
        content: '检查到有新版本可以更新',
        okText: '立即下载',
        onOk: () => (showUpdateModal.value = true)
      })
    } else if (type === 'download-progress') {
      console.log(text)
      modelText.value = text
    }
  })
})
</script>

<style lang="less">
ul,
li {
  list-style: none;
}
svg {
  vertical-align: middle;
}
.vue-waterfall-easy-scroll {
  overflow: inherit !important;
}
</style>
