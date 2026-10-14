<template>
  <div class="attr-item-box" v-if="isOne && isMatchType && isBarcode">
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
              <el-option
                :label="$t('editor.barCode.positionBottom')"
                value="bottom"
              ></el-option>
              <el-option
                :label="$t('editor.barCode.positionTop')"
                value="top"
              ></el-option>
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
              <SvgIcon
                extClass="text-20px"
                color="#fff"
                :icon="textAlignListSvg[i]"
              />
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.barCode.color') }}</span>
          <div class="content">
            <el-color-picker
              v-model="baseAttr.lineColor"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item" v-if="baseAttr.displayValue">
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
          <span class="label mr-10px">{{
            $t('editor.barCode.background')
          }}</span>
          <div class="content">
            <el-color-picker
              v-model="baseAttr.background"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label mr-10px">{{ $t('editor.type') }}</span>
          <div class="content">
            <el-select
              v-model="baseAttr.format"
              @change="changeCommon"
              style="width: 90px"
            >
              <el-option
                v-for="item in barcodeTypeList"
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

<script setup lang="ts">
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()
const { isOne, isMatchType } = useAttrPanel({
  matchTypes: ['image'],
  // 回显条码扩展属性,普通图片不回显
  getAttrs: (activeObject: any) => {
    extensionType.value = activeObject.extensionType || ''
    const extension = activeObject.get('extension')
    if (extensionType.value === 'barcode' && extension) {
      Object.keys(baseAttr).forEach((key) => {
        baseAttr[key] = extension[key]
      })
    }
  }
})

const extensionType = ref('')

const isBarcode = computed(() => extensionType.value === 'barcode')

// 属性值
const baseAttr = reactive<Record<string, any>>({
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

// 文字对齐方式
const textAlignList = ['left', 'center', 'right']
// 对齐图标
const textAlignListSvg = ['left', 'center', 'right']

// 通用属性改变:整体更新条码
const changeCommon = () => {
  editorStore.editor.setBarcode(toRaw(baseAttr))
  editorStore.canvas?.renderAll()
}

const barcodeTypeList = ref<string[]>([])

onMounted(() => {
  nextTick(() => {
    barcodeTypeList.value = editorStore.editor?.getBarcodeTypes() || []
  })
})
</script>
