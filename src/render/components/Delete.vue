<template>
  <el-tooltip v-if="mixinState.mSelectMode" :content="$t('quick.del')">
    <el-button @click="del" icon="ios-trash" link>
      <el-icon>
        <Delete />
      </el-icon>
    </el-button>
  </el-tooltip>
</template>

<script setup name="Delete">
import { Delete } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import useSelect from '@/hooks/select'

const { mixinState, canvasEditor } = useSelect()

const del = debounce(function () {
  canvasEditor.del()
}, 300)
</script>
