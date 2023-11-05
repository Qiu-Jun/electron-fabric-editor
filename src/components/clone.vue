<!--
 * @Author: June
 * @Description:
 * @Date: 2023-10-29 12:18:14
 * @LastEditors: June
 * @LastEditTime: 2023-11-06 01:38:21
-->
<template>
  <Tooltip v-if="mixinState.mSelectMode === 'one'" :content="$t('quick.copy')">
    <Button @click="clone" icon="ios-copy" type="text"></Button>
  </Tooltip>
</template>

<script name="Clone" lang="ts" setup>
import useSelect from '@/hooks/select'
import { debounce } from 'lodash-es'

const { mixinState, canvasEditor }: any = useSelect()
const clone = debounce(function () {
  canvasEditor.clone()
}, 300)
</script>
