<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-06 12:20:00
 * @Description: 锁定元素
-->

<template>
  <el-tooltip :content="$t('quick.lock')" v-if="mixinState.mSelectMode === 'one'">
    <el-button v-if="isLock" @click="doLock(false)" :icon="Lock" link></el-button>
    <el-button v-else @click="doLock(true)" :icon="Unlock" link></el-button>
  </el-tooltip>
</template>

<script setup name="Lock">
import { Lock, Unlock } from '@element-plus/icons-vue'
import useSelect from '@/hooks/select'

const { mixinState, canvasEditor } = useSelect()
const isLock = ref(false)
const doLock = (isLock) => {
  isLock ? canvasEditor.lock() : canvasEditor.unLock()
}

const handleSelected = (items) => {
  isLock.value = !items[0].selectable
}

onMounted(() => {
  canvasEditor.on('selectOne', handleSelected)
})

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', handleSelected)
})
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
