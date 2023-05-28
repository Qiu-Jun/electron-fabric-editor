<!--
 * @Author: June
 * @Description:
 * @Date: 2023-05-19 02:50:49
 * @LastEditors: June
 * @LastEditTime: 2023-05-22 14:34:15
-->
<template>
    <div class="update-wrap">
        <p>发现新版本</p>

        <progress v-if="updateProgress" max="100" value="70">70%</progress>

        <div style="display: flex; align-items: center" v-if="!updateProgress">
            <button @click="handleNotUpdate">暂不更新</button>
            <button @click="handleUpdate">立即更新</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const handleNotUpdate = () => {
    window.electronAPI.ipcRenderer.send('updateHide')
}
const updateProgress = ref(0)

const handleUpdate = () => {
    // ipcRenderer.send('updateShow')
}

onMounted(() => {
    window.electronAPI.ipcRenderer.on('updatemessage', (type, text) => {
        console.log(type, text)
    })
})
</script>

<style lang="scss" scoped>
.update-wrap {
    height: 300px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 50px;
    background-color: seagreen;
}
</style>
