<!--
 * @Author: 秦少卫
 * @Date: 2024-05-21 10:10:24
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-21 15:37:03
 * @Description: 阴影
-->

<template>
  <div class="box attr-item-box" v-if="mixinState.mSelectMode === 'one'">
    <!-- <h3>阴影</h3> -->
    <el-divider content-position="left"><h4>阴影</h4></el-divider>
    <!-- 通用属性 -->
    <el-row :gutter="12" style="margin-bottom: 10px">
      <el-col :span="12">
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f8f8f9;
            border-raius: 4px;
          "
        >
          <span class="label">{{ $t('color') }}</span>
          <div class="content">
            <el-color-picker v-model="baseAttr.shadow.color" @change="changeCommon" alpha />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <InputNumber
          v-model="baseAttr.shadow.blur"
          :defaultValue="0"
          @on-change="changeCommon"
          :append="$t('attributes.blur')"
          :min="0"
        ></InputNumber>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <InputNumber
          v-model="baseAttr.shadow.offsetX"
          :defaultValue="0"
          @on-change="changeCommon"
          :append="$t('attributes.offset_x')"
        ></InputNumber>
      </el-col>
      <el-col :span="12">
        <InputNumber
          v-model="baseAttr.shadow.offsetY"
          :defaultValue="0"
          @on-change="changeCommon"
          :append="$t('attributes.offset_y')"
        ></InputNumber>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select'
import InputNumber from './InputNumber'

const update = getCurrentInstance()
const { fabric, mixinState, canvasEditor } = useSelect()

// 属性值
const baseAttr = reactive({
  shadow: {}
})

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    baseAttr.shadow = activeObject.get('shadow') || {}
  }
}

// 通用属性改变
const changeCommon = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow))
    canvasEditor.canvas.renderAll()
  }
}

const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}

onMounted(() => {
  // 获取字体数据
  getObjectAttr()
  canvasEditor.on('selectCancel', selectCancel)
  canvasEditor.on('selectOne', getObjectAttr)
  canvasEditor.canvas.on('object:modified', getObjectAttr)
})

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel)
  canvasEditor.off('selectOne', getObjectAttr)
  canvasEditor.canvas.off('object:modified', getObjectAttr)
})
</script>

<style scoped lang="scss">
:deep(.el-color-picker__trigger) {
  width: 88px;
}
.label {
  margin-right: 4px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
