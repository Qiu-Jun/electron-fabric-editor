<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-21 15:38:38
 * @Description: 尺寸设置
-->

<template>
  <div v-if="!mixinState.mSelectMode" class="attr-item-box">
    <el-divider content-position="left">
      <h4>{{ $t('bgSeting.size') }}</h4>
    </el-divider>
    <el-form :label-width="40" inline class="form-wrap">
      <el-form-item :label="$t('bgSeting.width')" prop="name">
        <el-input style="width: 60px" disabled v-model="width" readonly></el-input>
      </el-form-item>
      <el-form-item :label="$t('bgSeting.height')" prop="name">
        <el-input style="width: 60px" disabled v-model="height" readonly></el-input>
      </el-form-item>
      <el-form-item :label-width="0">
        <el-button link @click="showSetSize">
          <el-icon><Edit /></el-icon>
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 修改尺寸 -->
    <ModalSize :title="$t('setSizeTip')" ref="modalSizeRef" @set="handleConfirm"></ModalSize>
  </div>
</template>

<script setup name="CanvasSize">
import { Edit } from '@element-plus/icons-vue'
import useSelect from '@/hooks/select'
import ModalSize from './common/ModalSize.vue'

const { mixinState, canvasEditor } = useSelect()

const DefaultSize = {
  width: 900,
  height: 1200
}

const modalSizeRef = ref(null)

let width = ref(DefaultSize.width)
let height = ref(DefaultSize.height)

onMounted(() => {
  canvasEditor.setSize(width.value, height.value)
  canvasEditor.on('sizeChange', (w, h) => {
    width.value = w
    height.value = h
  })
})

const setSize = () => {
  canvasEditor.setSize(width.value, height.value)
}

const showSetSize = () => {
  modalSizeRef.value.showSetSize(width.value, height.value)
}
const handleConfirm = (w, h) => {
  width.value = w
  height.value = h
  setSize()
}
</script>

<style scoped lang="scss">
.form-wrap {
  display: flex;
}
</style>
