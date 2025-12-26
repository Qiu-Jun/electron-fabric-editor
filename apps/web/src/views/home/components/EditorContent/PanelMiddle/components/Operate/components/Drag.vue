<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-11-24 09:51:35
 * @LastEditTime: 2024-11-24 10:00:38
 * @LastEditors: June
-->
<template>
  <el-switch
    class="mr-10px"
    size="large"
    v-model="dragEnabled"
    width="60"
    inline-prompt
    :active-text="$t('editor.drag')"
    :inactive-text="$t('editor.drag')"
    @change="switchMode"
  />
</template>

<script setup name="Drag">
import { useEditorStore } from '@/store/modules/editor'
const editorStore = useEditorStore()
const dragEnabled = ref(false)

const switchMode = (val) => {
  if (val) {
    editorStore.editor?.startDring()
  } else {
    editorStore.editor?.endDring()
  }
}

onMounted(() => {
  nextTick(() => {
    editorStore.editor?.on('startDring', () => (dragEnabled.value = true))
    editorStore.editor?.on('endDring', () => (dragEnabled.value = false))
  })
})

onBeforeUnmount(() => {
  editorStore.editor?.off('startDring')
  editorStore.editor?.off('endDring')
})
</script>
