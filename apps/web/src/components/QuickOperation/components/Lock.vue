<!--
 * @Author: June
 * @Description: 锁定快捷操作
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2026-09-14 10:30:00
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
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()
const { isOne } = useAttrPanel({
  // 回显锁定状态
  getAttrs: (activeObject: any) => {
    isLock.value = !activeObject.selectable
  }
})

const isLock = ref(false)
const doLock = (lock: boolean) => {
  lock ? editorStore.editor?.lock() : editorStore.editor?.unLock()
  isLock.value = lock
}
</script>
