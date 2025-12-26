<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-05 23:13:23
 * @LastEditTime: 2024-11-28 14:21:44
 * @LastEditors: June
 * @FilePath: \ai-desing\src\views\editor\components\Clone.vue
-->
<template>
  <el-tooltip v-if="isOne" :content="$t('editor.quickOperation.copy')">
    <el-button @click="clone" :icon="CopyDocument" link></el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { CopyDocument } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne } = useSelect()
const clone = debounce(function () {
  editorStore.editor.clone()
}, 300)
</script>
