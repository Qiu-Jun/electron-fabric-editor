<template>
  <div v-if="isOne && isMatchType" class="attr-item-box">
    <div class="flex-view">
      <div class="flex-item">
        <span class="label">{{ $t('editor.attrSetting.font.decimals') }}</span>
        <div class="flex-1">
          <el-select
            v-model="baseAttr.verticalAlign"
            @change="(value: any) => changeCommon('verticalAlign', value)"
          >
            <el-option
              :label="$t('editor.attrSetting.font.decimalsOptions.none')"
              value="null"
            ></el-option>
            <el-option
              :label="$t('editor.attrSetting.font.decimalsOptions.bottom')"
              value="bottom"
            ></el-option>
            <el-option
              :label="$t('editor.attrSetting.font.decimalsOptions.top')"
              value="top"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()

const matchType = ['i-text', 'textbox', 'text']
const { isMatchType, isOne } = useAttrPanel({
  matchTypes: matchType,
  // 仅含小数点的文字支持上下标
  getAttrs: (activeObject: any) => {
    if (activeObject?.text?.includes('.')) {
      baseAttr.verticalAlign = activeObject.get('verticalAlign')
    }
  }
})

const baseAttr = reactive({
  verticalAlign: 'null'
})

// 上标/下标作用于小数点后的部分
const changeCommon = (key: any, value: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject && activeObject.text.includes('.')) {
    const [init] = activeObject.text.split('.')
    const startIndex = init.length + 1
    const endIndex = activeObject.text.length
    activeObject.styles = []
    // 上标
    if (value === 'top') {
      activeObject.setSuperscript(startIndex, endIndex)
    } else if (value === 'bottom') {
      // 下标
      activeObject.setSelectionStyles(
        {
          fontSize: activeObject.superscript.size * activeObject.fontSize
        },
        startIndex,
        endIndex
      )
    }
    activeObject.set(key, value)
    editorStore.canvas?.renderAll()
  }
}
</script>
