<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2024-12-26 14:07:37
 * @LastEditors: June
-->
<template>
  <el-tooltip
    :content="
      isLock
        ? $t('editor.quickOperation.unlock')
        : $t('editor.quickOperation.lock')
    "
    v-if="isOne"
  >
    <el-button
      v-if="isLock"
      @click="doLock(false)"
      :icon="Lock"
      link
    ></el-button>
    <el-button v-else @click="doLock(true)" :icon="Unlock" link></el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { Lock, Unlock } from '@element-plus/icons-vue'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne } = useSelect()

const isLock = ref(false)
const doLock = (isLock: boolean) => {
  isLock ? editorStore.editor?.lock() : editorStore.editor?.unLock()
}

const handleSelected = (items: any) => {
  isLock.value = !items[0].selectable
}

onMounted(() => {
  nextTick(() => {
    editorStore.editor?.on('selectOne', handleSelected)
  })
})

onBeforeUnmount(() => {
  editorStore.editor?.off('selectOne', handleSelected)
})
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
