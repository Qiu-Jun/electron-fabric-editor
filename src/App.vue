<!--
 * @Author: June
 * @Description:
 * @Date: 2023-10-29 12:18:14
 * @LastEditors: June
 * @LastEditTime: 2023-11-07 17:07:33
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script name="App" lang="ts" setup>
onMounted(() => {
  window?.nativeBridge?.onAppUpdateMsg((type: any, text: any) => {
    console.log(type, text)
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
