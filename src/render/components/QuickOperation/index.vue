<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-11-28 14:14:43
 * @LastEditTime: 2024-11-28 14:21:07
 * @LastEditors: June
-->
<template>
  <el-divider content-position="left">
    <h4>{{ $t('editor.quickOperation.title') }}</h4>
  </el-divider>
  <div class="bg-item" v-show="mixinState.mSelectMode">
    <Lock />
    <Delete />
    <Clone />
    <Hide />
    <Edit />
  </div>
</template>

<script lang="ts" setup>
import { Lock, Delete, Clone, Hide, Edit } from './components'
import useSelect from '@/hooks/select'
const { mixinState } = useSelect()
</script>
