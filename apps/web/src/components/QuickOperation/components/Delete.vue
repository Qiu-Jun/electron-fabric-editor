<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2024-09-20 10:41:18
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\components\Delete.vue
-->
<template>
  <el-tooltip v-if="isSelect" :content="$t('editor.quickOperation.delete')">
    <el-button @click="del" :icon="Delete" link></el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isSelect } = useSelect()
const del = debounce(function () {
  editorStore.editor.del()
}, 300)
</script>
