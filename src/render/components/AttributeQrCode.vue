<!--
 * @Author: 秦少卫
 * @Date: 2024-06-06 20:04:48
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-07 20:56:55
 * @Description: 二维码组件
-->

<template>
  <div
    class="box attr-item-box"
    v-if="
      mixinState.mSelectMode === 'one' && textType.includes(mixinState.mSelectOneType) && isQrcode
    "
  >
    <!-- <h3>字体属性</h3> -->
    <el-divider content-position="left"><h4>二位码属性</h4></el-divider>
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">内容</span>
          <div class="content">
            <el-input v-model="baseAttr.data" @change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <div class="content number-content">
            <InputNumber
              v-model="baseAttr.width"
              @on-change="changeCommon"
              append="宽度"
              :min="1"
            ></InputNumber>
          </div>
        </div>
        <div class="flex-item" style="margin-left: 20px">
          <div class="content number-content">
            <InputNumber
              v-model="baseAttr.margin"
              @on-change="changeCommon"
              append="边距"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">散点</span>
          <div class="content">
            <el-color-picker
              id="dotsColor"
              v-model="baseAttr.dotsColor"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">类型</span>
          <div class="content">
            <el-select v-model="baseAttr.dotsType" @change="changeCommon" style="width: 90px">
              <el-option v-for="item in optionsList.DotsType" :value="item" :key="item">
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">外角</span>
          <div class="content">
            <el-color-picker
              id="cornersSquareColor"
              v-model="baseAttr.cornersSquareColor"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">类型</span>
          <div class="content">
            <el-select
              v-model="baseAttr.cornersSquareType"
              @change="changeCommon"
              style="width: 90px"
            >
              <el-option v-for="item in optionsList.cornersDotType" :value="item" :key="item">
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">内角</span>
          <div class="content">
            <el-color-picker
              id="cornersDotColor"
              v-model="baseAttr.cornersDotColor"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">类型</span>
          <div class="content">
            <el-select v-model="baseAttr.cornersDotType" @change="changeCommon" style="width: 90px">
              <el-option v-for="item in optionsList.cornersDotType" :value="item" :key="item">
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">背景</span>
          <div class="content">
            <el-color-picker
              id="background"
              v-model="baseAttr.background"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">容错</span>
          <div class="content">
            <el-select
              v-model="baseAttr.errorCorrectionLevel"
              @change="changeCommon"
              style="width: 90px"
            >
              <el-option
                v-for="item in optionsList.errorCorrectionLevelType"
                :value="item"
                :key="item"
              >
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
import InputNumber from './InputNumber'

const update = getCurrentInstance()
const { mixinState, canvasEditor } = useSelect()

// 文字元素
const textType = ['image']
const extensionType = ref('')

const isQrcode = computed(() => extensionType.value === 'qrcode')

// 属性值
const baseAttr = reactive({
  data: '',
  width: 300,
  margin: 10,
  errorCorrectionLevel: 'M',
  dotsColor: '#000000',
  dotsType: 'rounded',
  cornersSquareColor: '#000000',
  cornersSquareType: 'dot',
  cornersDotColor: '#000000',
  cornersDotType: 'square',
  background: '#ffffff'
})

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  extensionType.value = activeObject?.extensionType || ''
  if (
    activeObject &&
    textType.includes(activeObject.type) &&
    activeObject?.extensionType === 'qrcode'
  ) {
    const extension = activeObject.get('extension')
    Object.keys(extension).forEach((key) => {
      baseAttr[key] = extension[key]
    })
    console.log(baseAttr)
  }
}

// 通用属性改变
const changeCommon = () => {
  canvasEditor.setQrCode(toRaw(baseAttr))
  canvasEditor.canvas.renderAll()
}

const selectCancel = () => {
  extensionType.value = ''
  update?.proxy?.$forceUpdate()
}

// 容错率

const res = canvasEditor.getQrCodeTypes()
const optionsList = reactive(res)

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
.number-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    height: 40px;
    width: 330px;
    background-size: auto 40px;
    background-repeat: no-repeat;
  }
}

.flex-view {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
  position: relative;
  z-index: 1;
}
.flex-item {
  box-sizing: border-box;
  display: inline-flex;
  flex: 1;
  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    // color: #333333;
  }
  .content {
    flex: 1;
    // width: 60px;
  }
  .slider-box {
    width: calc(100% - 50px);
    margin-left: 10px;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
    margin-left: 10px;
  }
}
</style>
