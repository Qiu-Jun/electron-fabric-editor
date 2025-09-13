<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
    <el-divider content-position="left"
      ><h4>{{ $t('editor.attrSetting.font.title') }}</h4></el-divider
    >
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <div class="left font-selector">
            <el-select v-model="baseAttr.fontFamily" @change="changeFontFamily">
              <el-option
                v-for="item in fontsList"
                :value="item.name"
                :label="item.name"
                :key="`font-${item.name}`"
              >
                <div
                  class="font-item"
                  :style="`background-image:url('${item.img}');height: 100%;background-size: 100% 100%;`"
                >
                  {{ !item.img ? item : '' }}
                  <!-- 解决无法选中问题 -->
                  <span style="display: none">{{ item.name }}</span>
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="right">
            <InputNumber
              v-model="baseAttr.fontSize"
              @on-change="(value) => changeCommon('fontSize', value)"
              :append="$t('editor.attrSetting.font.fontSize')"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>

      <div class="flex-view" style="margin-bottom: 0">
        <div class="flex-item">
          <el-radio-group
            class="button-group"
            v-model="baseAttr.textAlign"
            @change="(value: any) => changeCommon('textAlign', value)"
            type="button"
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
          <el-button-group class="button-group">
            <el-button
              style="width: 25%"
              @click="changeFontWeight('fontWeight', baseAttr.fontWeight)"
            >
              <SvgIcon
                extClass="text-20px"
                color="#fff"
                icon="atb-fontWeight"
              />
            </el-button>
            <el-button
              style="width: 25%"
              @click="changeFontStyle('fontStyle', baseAttr.fontStyle)"
            >
              <SvgIcon extClass="text-20px" color="#fff" icon="atb-fontStyle" />
            </el-button>
            <el-button
              style="width: 25%"
              @click="changeLineThrough('linethrough', baseAttr.linethrough)"
            >
              <SvgIcon
                extClass="text-20px"
                color="#fff"
                icon="atb-linethrough"
              />
            </el-button>
            <el-button
              style="width: 25%"
              @click="changeUnderline('underline', baseAttr.underline)"
            >
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <SvgIcon
                  extClass="text-20px"
                  color="#fff"
                  icon="atb-underline"
                />
              </svg>
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div class="flex-view">
        <div class="right">
          <InputNumber
            v-model="baseAttr.lineHeight"
            @on-change="(value) => changeCommon('lineHeight', value)"
            :step="0.1"
            :append="$t('editor.attrSetting.font.lineHeight')"
          ></InputNumber>
        </div>
        <div class="right">
          <InputNumber
            v-model="baseAttr.charSpacing"
            @on-change="(value) => changeCommon('charSpacing', value)"
            :append="$t('editor.attrSetting.font.space')"
          ></InputNumber>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{
            $t('editor.attrSetting.font.background')
          }}</span>
          <div class="content">
            <el-color-picker
              v-model="baseAttr.textBackgroundColor"
              @change="
                (value: any) => changeCommon('textBackgroundColor', value)
              "
              show-alpha
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

// 文字元素
const textType = ['i-text', 'textbox', 'text']

const editorStore = useEditorStore()
const { isMatchType, isOne } = useSelect(textType)
const update = getCurrentInstance()

// 属性值
const baseAttr = reactive<Record<string, any>>({
  fontSize: 0,
  fontFamily: '',
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: '',
  textBackgroundColor: '#fff',
  textAlign: '',
  fontStyle: '',
  underline: false,
  linethrough: false,
  overline: false
})

const fontsList: any = ref([])
editorStore.editor?.getFontList().then((list: any) => {
  fontsList.value = list
})

// 字体对齐方式
const textAlignList = ['left', 'center', 'right', 'justify']
// 对齐图标
const textAlignListSvg = [
  'text-align-left',
  'text-align-center',
  'text-align-right',
  'text-align-justitfy'
]

// 属性获取
const getObjectAttr = (e?: any) => {
  const activeObject = editorStore.canvas?.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  // @ts-ignore
  if (activeObject && isMatchType) {
    // @ts-ignore
    baseAttr.fontSize = activeObject.get('fontSize')
    // @ts-ignore
    baseAttr.fontFamily = activeObject.get('fontFamily')
    // @ts-ignore
    baseAttr.lineHeight = activeObject.get('lineHeight')
    // @ts-ignore
    baseAttr.textAlign = activeObject.get('textAlign')
    // @ts-ignore
    baseAttr.underline = activeObject.get('underline')
    // @ts-ignore
    baseAttr.linethrough = activeObject.get('linethrough')
    // @ts-ignore
    baseAttr.charSpacing = activeObject.get('charSpacing')
    // @ts-ignore
    baseAttr.overline = activeObject.get('overline')
    // @ts-ignore
    baseAttr.fontStyle = activeObject.get('fontStyle')
    // @ts-ignore
    baseAttr.textBackgroundColor = activeObject.get('textBackgroundColor')
    // @ts-ignore
    baseAttr.fontWeight = activeObject.get('fontWeight')
  }
}

// 通用属性改变
const changeCommon = (key: any, value: any) => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    activeObject && activeObject.set(key, value)
    editorStore.canvas?.renderAll()
  }
}

const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}

const changeFontFamily = async (fontName: string) => {
  if (!fontName) return
  const loadingINstasncdee = ElLoading.service()
  editorStore.editor
    .loadFont(fontName)
    .finally(() => loadingINstasncdee.close())
}
const changeFontWeight = (key: any, value: any) => {
  const nValue = value === 'normal' ? 'bold' : 'normal'
  baseAttr.fontWeight = nValue
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  editorStore.canvas?.renderAll()
}

// 斜体
const changeFontStyle = (key: any, value: any) => {
  const nValue = value === 'normal' ? 'italic' : 'normal'
  baseAttr.fontStyle = nValue
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  editorStore.canvas?.renderAll()
}

// 中划
const changeLineThrough = (key: any, value: any) => {
  const nValue = value === false
  baseAttr.linethrough = nValue
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  editorStore.canvas?.renderAll()
}

// 下划
const changeUnderline = (key: any, value: any) => {
  const nValue = value === false
  baseAttr.underline = nValue
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  editorStore.canvas?.renderAll()
}

onMounted(() => {
  // 获取字体数据

  nextTick(() => {
    getObjectAttr()
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
:deep(.el-color-picker) {
  @apply w-full;
}
:deep(.el-color-picker__trigger) {
  @apply w-full;
}
:deep(.el-color-picker__color-inner) {
  @apply justify-end;
}
.right {
  @apply flex justify-end items-center;
  & > span {
    flex: 0 0 36px;
  }
}

.button-group {
  @apply w-full;
  :deep(.el-radio-button) {
    @apply f-center flex-1;
    .el-radio-button__inner {
      @apply flex-1;
    }
  }
}
.font-selector {
  .font-item {
    background-size: auto 28px;
    background-repeat: no-repeat;
    @apply w-280px h-40px;
  }
}

.flex-view {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
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
