<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-13 23:43:01
 * @LastEditors: June
 * @LastEditTime: 2023-05-22 14:35:06
-->
<template>
    <div>home1</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
const platform = window.electronAPI.platform
console.log(platform)
console.log(window)

onMounted(() => {
    window.electronAPI.ipcRenderer.send('updateShow')
})
</script>
