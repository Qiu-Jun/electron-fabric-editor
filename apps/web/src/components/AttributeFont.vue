<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
    <el-divider content-position="left"
      ><h4>{{ $t('editor.attrSetting.font.title') }}</h4></el-divider
    >
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <div class="left font-selector">
            <!-- 虚拟滚动下拉,避免一次性渲染上百个带预览图的选项 -->
            <el-select-v2
              v-model="baseAttr.fontFamily"
              :options="fontOptions"
              popper-class="font-select-popper"
              @change="changeFontFamily"
            >
              <template #item="{ item }">
                <div
                  class="font-item"
                  :style="
                    item.img
                      ? `background-image:url('${item.img}');background-size: 100% 100%;`
                      : ''
                  "
                >
                  {{ item.label }}
                </div>
              </template>
            </el-select-v2>
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
            <el-button style="width: 25%" @click="changeFontWeight">
              <SvgIcon
                extClass="text-20px"
                color="#fff"
                icon="atb-fontWeight"
              />
            </el-button>
            <el-button style="width: 25%" @click="changeFontStyle">
              <SvgIcon extClass="text-20px" color="#fff" icon="atb-fontStyle" />
            </el-button>
            <el-button style="width: 25%" @click="changeLineThrough">
              <SvgIcon
                extClass="text-20px"
                color="#fff"
                icon="atb-linethrough"
              />
            </el-button>
            <el-button style="width: 25%" @click="changeUnderline">
              <SvgIcon extClass="text-20px" color="#fff" icon="atb-underline" />
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
import useAttrPanel from '@/hooks/useAttrPanel'

// 文字元素
const textType = ['i-text', 'textbox', 'text']

const editorStore = useEditorStore()
const { isMatchType, isOne, changeCommon } = useAttrPanel({
  matchTypes: textType,
  // 回显文字属性
  getAttrs: (activeObject) => {
    keys.forEach((key) => {
      baseAttr[key] = activeObject.get(key)
    })
  }
})

// 需要回显的属性
const keys = [
  'fontSize',
  'fontFamily',
  'lineHeight',
  'textAlign',
  'underline',
  'linethrough',
  'charSpacing',
  'overline',
  'fontStyle',
  'textBackgroundColor',
  'fontWeight'
]

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
// 字体清单由 FontPlugin 内部缓存,重复调用不会重复请求
editorStore.editor?.getFontList().then((list: any) => {
  fontsList.value = list
})
// el-select-v2 需要 { value, label } 结构
const fontOptions = computed(() =>
  fontsList.value.map((item: any) => ({
    value: item.name,
    label: item.name,
    img: item.img
  }))
)

// 字体对齐方式
const textAlignList = ['left', 'center', 'right', 'justify']
// 对齐图标
const textAlignListSvg = [
  'text-align-left',
  'text-align-center',
  'text-align-right',
  'text-align-justitfy'
]

const changeFontFamily = async (fontName: string) => {
  if (!fontName) return
  const loadingInstance = ElLoading.service()
  editorStore.editor.loadFont(fontName).finally(() => loadingInstance.close())
}

// 加粗/斜体/划线类按钮统一走切换逻辑
const toggleFontAttr = (key: string, nValue: string | boolean) => {
  baseAttr[key] = nValue
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    activeObject.set(key, nValue)
    editorStore.canvas?.renderAll()
  }
}

const changeFontWeight = () => {
  toggleFontAttr(
    'fontWeight',
    baseAttr.fontWeight === 'normal' ? 'bold' : 'normal'
  )
}

// 斜体
const changeFontStyle = () => {
  toggleFontAttr(
    'fontStyle',
    baseAttr.fontStyle === 'normal' ? 'italic' : 'normal'
  )
}

// 中划
const changeLineThrough = () => {
  toggleFontAttr('linethrough', !baseAttr.linethrough)
}

// 下划
const changeUnderline = () => {
  toggleFontAttr('underline', !baseAttr.underline)
}
</script>

<style scoped lang="scss">
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
</style>

<style lang="scss">
/* 字体下拉弹层挂在 body 下,需全局样式控制选项高度 */
.font-select-popper {
  .el-select-dropdown__item {
    height: 40px;
    line-height: 40px;
  }
}
</style>
