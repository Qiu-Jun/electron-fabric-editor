<template>
  <teleport to="body">
    <el-dialog
      v-bind="omit(props, ['open', 'onCancel', 'onOk', 'onUpdate:open'])"
      v-model="openModel"
      :title="String($attrs.title)"
      destroy-on-close
      center
      @close="handleCancel"
    >
      <template v-if="typeof $attrs.content === 'string'">
        <slot />
      </template>
      <template v-else>
        <component :is="$attrs.content" />
      </template>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </teleport>
</template>

<script lang="ts" name="Modal" setup>
import { omit, debounce } from 'lodash-es'
const emits = defineEmits(['update:open', 'ok', 'cancel'])

const props = defineProps({})

const openModel = defineModel<boolean>('open')

const handleCancel = debounce(function () {
  emits('cancel', false)
}, 250)
const handleConfirm = debounce(function () {
  emits('ok')
}, 250)
</script>
