<template>
  <div class="attr-item-box" v-if="isOne && isMatchType && isBarcode">
    <!-- <h3>字体属性</h3> -->
    <el-divider content-position="left">
      <h4>{{ $t('editor.barCode.name') }}</h4>
    </el-divider>
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.barCode.content') }}</span>
          <div class="content">
            <el-input v-model="baseAttr.value" @change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view" v-if="baseAttr.displayValue">
        <div class="flex-item">
          <span class="label">{{ $t('editor.barCode.text') }}</span>
          <div class="content">
            <el-input v-model="baseAttr.text" @change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.barCode.show') }}</span>
          <div class="content">
            <el-switch v-model="baseAttr.displayValue" @change="changeCommon" />
          </div>
        </div>
        <div class="flex-item" v-if="baseAttr.displayValue">
          <span class="label">{{ $t('editor.barCode.position') }}</span>
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
              <SvgIcon extClass="text-20px" color="#fff" :icon="textAlignListSvg[i]" />
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="flex-view">
        <div :span="12" class="flex-item">
          <span class="label">{{ $t('editor.barCode.color') }}</span>
          <div class="content">
            <el-color-picker v-model="baseAttr.lineColor" @change="changeCommon" show-alpha />
          </div>
        </div>
        <div :span="12" class="flex-item" v-if="baseAttr.displayValue">
          <div class="content f-center">
            <InputNumber
              v-model="baseAttr.fontSize"
              @on-change="changeCommon"
              :append="$t('editor.barCode.size')"
              :min="1"
            />
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.barCode.background') }}</span>
          <div class="content">
            <el-color-picker v-model="baseAttr.background" @change="changeCommon" show-alpha />
          </div>
        </div>
        <div class="flex-item">
          <span class="label mr-10px">{{ $t('editor.type') }}</span>
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

<script setup lang="ts">
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne, isMatchType } = useSelect(['image'])
const update = getCurrentInstance()

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
const textAlignListSvg = ['left', 'center', 'right']

// 属性获取
const getObjectAttr = (e?: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  extensionType.value = activeObject?.extensionType || ''
  if (activeObject && isMatchType && activeObject?.extensionType === 'barcode') {
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
  editorStore.editor.setBarcode(toRaw(baseAttr))
  editorStore.canvas?.renderAll()
}

const selectCancel = () => {
  extensionType.value = ''
  update?.proxy?.$forceUpdate()
}

const barcodeTypeList = ref([])

onMounted(() => {
  nextTick(() => {
    getObjectAttr()
    barcodeTypeList.value = editorStore.editor?.getBarcodeTypes()
    editorStore.editor?.on('selectCancel', selectCancel)
    editorStore.editor?.on('selectOne', getObjectAttr)
    editorStore.canvas?.on('object:modified', getObjectAttr)
  })
})

onBeforeUnmount(() => {
  editorStore.editor?.off('selectCancel', selectCancel)
  editorStore.editor?.off('selectOne', getObjectAttr)
  editorStore.canvas?.off('object:modified', getObjectAttr)
})
</script>

<style scoped lang="scss">
:deep(.el-color-picker__trigger) {
  width: 88px;
}

.flex-item {
  @apply flex-1 inline-flex box-border;
  .label {
    @apply w-32px h-32px leading-32px inline-block text-14px;
  }
  .content {
    flex: 1;
    // width: 60px;
  }
  .slider-box {
    width: calc(100% - 50px);
    @apply mb-10px;
  }
}
</style>
