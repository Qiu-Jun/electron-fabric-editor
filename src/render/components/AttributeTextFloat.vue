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
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()

const baseAttr = reactive({
  verticalAlign: 'null'
})

const matchType = ['i-text', 'textbox', 'text']
const { isMatchType, isOne } = useSelect(matchType)

const getObjectAttr = (e?: any) => {
  const activeObject = editorStore.canvas?.getActiveObject() as any
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject && isMatchType && activeObject?.text?.includes('.')) {
    // @ts-ignore
    baseAttr.verticalAlign = activeObject.get('verticalAlign')
  }
}

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

const update = getCurrentInstance()
const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}

onMounted(() => {
  nextTick(() => {
    // 获取字体数据
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
.flex-view {
  background: #f6f7f9;
  @apply rounded-5px inline-block relative z-1 w-full mb-5px p-5px justify-between;
}
.flex-item {
  @apply inline-flex flex-1;
  .label {
    @apply w-32px h-32px leading-32px inline-block text-14px;
    // color: #333333;
  }
}
</style>
