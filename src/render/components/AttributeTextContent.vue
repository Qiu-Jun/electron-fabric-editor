<script setup name="AttrBute">
import useSelect from '@/hooks/select'
import InputNumber from './InputNumber'

const update = getCurrentInstance()
const { mixinState, canvasEditor } = useSelect()
const baseAttr = reactive({
  text: '',
  strokeWidth: 1,
  stroke: '',
  showPathAttr: false
})
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    baseAttr.text = activeObject.get('text')
    const path = activeObject.get('path')
    if (path) {
      baseAttr.strokeWidth = path.strokeWidth
      baseAttr.stroke = path.stroke
      baseAttr.showPathAttr = true
    } else {
      baseAttr.showPathAttr = false
    }
  }
}
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    baseAttr[key] = value
    if (key === 'text') {
      activeObject.set(key, value)
    } else {
      const path = activeObject.get('path')
      path.set(key, value)
    }
    canvasEditor.canvas.renderAll()
  }
}
const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}
onMounted(() => {
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

<template>
  <div
    class="box attr-item-box"
    v-if="mixinState.mSelectMode === 'one' && mixinState.mSelectOneType === 'i-text'"
  >
    <!-- <h3>数据</h3> -->
    <el-divider content-position="left"><h4>文本内容</h4></el-divider>

    <el-form :label-width="40" class="form-wrap">
      <el-form-item :label="$t('attributes.id')">
        <el-input
          v-model="baseAttr.text"
          @change="changeCommon('text', baseAttr.text)"
          size="small"
        />
      </el-form-item>
    </el-form>

    <template v-if="baseAttr.showPathAttr">
      <!-- <h3>数据</h3> -->
      <el-divider content-position="left"><h4>文本路径</h4></el-divider>
      <div>
        <el-row :gutter="12">
          <el-col flex="1">
            <div class="ivu-col__box">
              <span class="label">{{ $t('color') }}</span>
              <div class="content">
                <el-color-picker
                  v-model="baseAttr.stroke"
                  @change="(value) => changeCommon('stroke', value)"
                  show-alpha
                />
              </div>
            </div>
          </el-col>
          <el-col flex="1">
            <InputNumber
              v-model="baseAttr.strokeWidth"
              @on-change="(value) => changeCommon('strokeWidth', value)"
              :append="$t('width')"
              :min="0"
            ></InputNumber>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.color-bar {
  // width: 30px;
  height: 30px;
  cursor: pointer;
  border: 2px solid #f6f7f9;
}
.ivu-row {
  margin-bottom: 8px;
  .ivu-col {
    position: inherit;
    &__box {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 4px;
      gap: 8px;
    }
  }

  .label {
    padding-left: 8px;
  }
  .content {
    flex: 1;
    :deep(.--input),
    :deep(.ivu-select-selection) {
      background-color: transparent;
      border: none !important;
      box-shadow: none !important;
    }
  }
}
</style>
