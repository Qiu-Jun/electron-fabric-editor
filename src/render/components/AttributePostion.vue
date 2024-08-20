<!--
 * @Author: 秦少卫
 * @Date: 2024-05-21 09:23:36
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-21 15:37:27
 * @Description: file content
-->
<template>
  <div class="box attr-item-box" v-if="mixinState.mSelectMode === 'one'">
    <!-- <h3>位置信息</h3> -->
    <el-divider content-position="left"><h4>位置信息</h4></el-divider>
    <!-- 通用属性 -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="12">
          <InputNumber
            v-model="baseAttr.left"
            :append="$t('attributes.left')"
            @on-change="(value) => changeCommon('left', value)"
          />
        </el-col>
        <el-col :span="12">
          <InputNumber
            v-model="baseAttr.right"
            :append="$t('attributes.top')"
            @on-change="(value) => changeCommon('top', value)"
          />
        </el-col>
      </el-row>

      <div class="asa-number-warp">
        <span>{{ $t('attributes.angle') }}</span>
        <el-slider
          v-model="baseAttr.angle"
          :max="360"
          @input="(value) => changeCommon('angle', value)"
        ></el-slider>
      </div>

      <div class="asa-number-warp">
        <span>{{ $t('attributes.opacity') }}</span>
        <el-slider
          v-model="baseAttr.opacity"
          @input="(value) => changeCommon('opacity', value)"
        ></el-slider>
      </div>
    </div>
    <!-- <Divider plain></Divider> -->
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select'
import InputNumber from './InputNumber'

const update = getCurrentInstance()
const { mixinState, canvasEditor } = useSelect()

// 可修改的元素
const baseType = [
  'text',
  'i-text',
  'textbox',
  'rect',
  'circle',
  'triangle',
  'polygon',
  'image',
  'group',
  'line',
  'arrow',
  'thinTailArrow'
]

// 属性值
const baseAttr = reactive({
  opacity: 0,
  angle: 0,
  left: 0,
  top: 0,
  rx: 0,
  ry: 0
})

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject && baseType.includes(activeObject.type)) {
    baseAttr.opacity = activeObject.get('opacity') * 100
    baseAttr.left = activeObject.get('left')
    baseAttr.top = activeObject.get('top')
    baseAttr.angle = activeObject.get('angle') || 0
  }
}

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    // 透明度特殊转换
    if (key === 'opacity') {
      activeObject && activeObject.set(key, value / 100)
      canvasEditor.canvas.renderAll()
      return
    }
    // 旋转角度适配
    if (key === 'angle') {
      activeObject.rotate(value)
      canvasEditor.canvas.renderAll()
      return
    }
    activeObject && activeObject.set(key, value)
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

<style lang="scss" scoped>
.asa-number-warp {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #f6f7f9;
  border-radius: 5px;
  padding: 0 15px 0 10px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
  span {
    display: inline-block;
    width: 56px;
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
}
</style>
