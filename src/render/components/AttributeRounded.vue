<!--
 * @Author: 秦少卫
 * @Date: 2024-05-21 10:18:57
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-26 22:59:26
 * @Description: 圆角
-->
<template>
  <div
    class="box attr-item-box"
    v-if="mixinState.mSelectMode === 'one' && rectType.includes(mixinState.mSelectOneType)"
  >
    <!-- <h3>圆角</h3> -->
    <el-divider content-position="left"><h4>圆角</h4></el-divider>
    <!-- 通用属性 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18" flex="1">
          <el-form :label-width="40" class="form-wrap">
            <el-form-item :label="$t('attributes.rx_ry')">
              <el-slider
                v-model="baseAttr.rx"
                :max="300"
                @input="(value) => changeCommon(value)"
              ></el-slider>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" flex="1">
          <InputNumber
            v-model="baseAttr.rx"
            min="0"
            max="300"
            @on-change="(value) => changeCommon(value)"
          ></InputNumber>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select'
import InputNumber from './InputNumber'

const update = getCurrentInstance()
const { mixinState, canvasEditor } = useSelect()

// 矩形元素
const rectType = ['rect']

// 属性值
const baseAttr = reactive({
  rx: 0,
  ry: 0
})

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    baseAttr.rx = activeObject.get('rx')
    baseAttr.ry = activeObject.get('ry')
  }
}

// 通用属性改变
const changeCommon = (value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    activeObject.set('ry', value)
    activeObject.set('rx', value)
    canvasEditor.canvas.renderAll()
  }
}

const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}

onMounted(() => {
  // 获取圆角数据
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

<style scoped lang="scss"></style>
