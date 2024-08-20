<template>
  <el-tooltip v-if="mixinState.mSelectMode === 'one'" :content="$t('quick.copy')">
    <el-button @click="clone" :icon="CopyDocument" link></el-button>
  </el-tooltip>
</template>

<script setup name="Clone">
import { CopyDocument } from '@element-plus/icons-vue'
import useSelect from '@/hooks/select'
import { debounce } from 'lodash-es'

const { mixinState, canvasEditor } = useSelect()
const clone = debounce(function () {
  canvasEditor.clone()
}, 300)
</script>
