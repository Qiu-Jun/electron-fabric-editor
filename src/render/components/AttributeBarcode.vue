<!--
 * @Author: 秦少卫
 * @Date: 2024-06-06 16:27:21
 * @LastEditors: June
 * @LastEditTime: 2024-07-26 21:13:06
 * @Description: 条形码插件
-->

<template>
  <div
    class="attr-item-box"
    v-if="
      mixinState.mSelectMode === 'one' && textType.includes(mixinState.mSelectOneType) && isBarcode
    "
  >
    <!-- <h3>字体属性</h3> -->
    <el-divider content-position="left"><h4>条形码属性</h4></el-divider>
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">代码</span>
          <div class="content">
            <el-input v-model="baseAttr.value" @change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view" v-if="baseAttr.displayValue">
        <div class="flex-item">
          <span class="label">文字</span>
          <div class="content">
            <el-input v-model="baseAttr.text" @change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">显示</span>
          <div class="content">
            <el-switch v-model="baseAttr.displayValue" @change="changeCommon" />
          </div>
        </div>
        <div class="flex-item" v-if="baseAttr.displayValue">
          <span class="label">垂直</span>
          <div class="content">
            <el-select v-model="baseAttr.textPosition" @change="changeCommon">
              <el-option value="bottom">bottom</el-option>
              <el-option value="top">top</el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="flex-view" v-if="baseAttr.displayValue">
        <div class="flex-item">
          <el-radio-group
            class="button-group"
            v-model="baseAttr.textAlign"
            @change="changeCommon"
            size="small"
          >
            <el-radio-button
              v-for="(item, i) in textAlignList"
              :label="item"
              :value="item"
              :key="item"
            >
              <span v-html="textAlignListSvg[i]"></span>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="flex-view">
        <div :span="12" class="flex-item">
          <span class="label">条码</span>
          <div class="content">
            <el-color-picker v-model="baseAttr.lineColor" @change="changeCommon" show-alpha />
          </div>
        </div>
        <div :span="12" class="flex-item" v-if="baseAttr.displayValue">
          <div class="content f-center">
            <InputNumber
              v-model="baseAttr.fontSize"
              @on-change="changeCommon"
              append="字号"
              :min="1"
            />
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">背景</span>
          <div class="content">
            <el-color-picker v-model="baseAttr.background" @change="changeCommon" show-alpha />
          </div>
        </div>
        <div class="flex-item">
          <span class="label mr-10px">类型</span>
          <div class="content">
            <el-select v-model="baseAttr.format" @on-change="changeCommon" style="width: 90px">
              <el-option v-for="item in barcodeTypeList" :value="item" :key="item">
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select'
import { toRaw } from 'vue'
import InputNumber from './InputNumber'

const update = getCurrentInstance()
const { mixinState, canvasEditor } = useSelect()

// 文字元素
const textType = ['image']
const extensionType = ref('')

const isBarcode = computed(() => extensionType.value === 'barcode')

// 属性值
const baseAttr = reactive({
  value: '',
  format: '',
  text: '12121',
  textAlign: 'left',
  textPosition: 'bottom',
  fontSize: 12,
  background: '',
  lineColor: '',
  displayValue: false
})

// 字体对齐方式
const textAlignList = ['left', 'center', 'right']
// 对齐图标
const textAlignListSvg = [
  '<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="18" height="18"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>',
  '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="18" height="18"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>',
  '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="18" height="18"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>'
]

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  extensionType.value = activeObject?.extensionType || ''
  if (
    activeObject &&
    textType.includes(activeObject.type) &&
    activeObject?.extensionType === 'barcode'
  ) {
    baseAttr.value = activeObject.get('extension').value
    baseAttr.format = activeObject.get('extension').format
    baseAttr.text = activeObject.get('extension').text
    baseAttr.textAlign = activeObject.get('extension').textAlign
    baseAttr.textPosition = activeObject.get('extension').textPosition
    baseAttr.fontSize = activeObject.get('extension').fontSize
    baseAttr.background = activeObject.get('extension').background
    baseAttr.lineColor = activeObject.get('extension').lineColor
    baseAttr.displayValue = activeObject.get('extension').displayValue
  }
}

// 通用属性改变
const changeCommon = () => {
  canvasEditor.setBarcode(toRaw(baseAttr))
  canvasEditor.canvas.renderAll()
}

const selectCancel = () => {
  extensionType.value = ''
  update?.proxy?.$forceUpdate()
}

const barcodeTypeList = ref([])
barcodeTypeList.value = canvasEditor.getBarcodeTypes()

onMounted(() => {
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

.font-selector {
  .font-item {
    height: 40px;
    width: 330px;
    background-size: auto 40px;
    background-repeat: no-repeat;
  }
}

.flex-view {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
  .flex-item {
    display: inline-flex;
    flex: 1;
    .label {
      width: 32px;
      height: 32px;
      line-height: 32px;
      display: inline-block;
      font-size: 14px;
    }
    .content {
      flex: 1;
      align-content: center;
    }
    .button-group {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-radio-button {
        flex: 1;
        :deep(.el-radio-button__inner) {
          width: 100%;
        }
      }
    }
    .slider-box {
      width: calc(100% - 50px);
      margin-left: 10px;
    }
  }
}
</style>
