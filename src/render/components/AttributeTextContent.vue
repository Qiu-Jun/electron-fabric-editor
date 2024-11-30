<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
    <!-- <h3>数据</h3> -->
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.text.content') }}</h4>
    </el-divider>

    <el-form :label-width="40" class="form-wrap">
      <el-form-item :label="$t('editor.attributes.id')">
        <el-input
          v-model="baseAttr.text"
          @change="changeCommon('text', baseAttr.text)"
          size="small"
        />
      </el-form-item>
    </el-form>

    <template v-if="baseAttr.showPathAttr">
      <!-- <h3>数据</h3> -->
      <el-divider content-position="left">
        <h4>{{ $t('editor.attrSetting.text.path') }}</h4>
      </el-divider>
      <div>
        <el-row :gutter="12">
          <el-col flex="1">
            <div class="ivu-col__box">
              <span class="label">{{ $t('editor.color') }}</span>
              <div class="content">
                <el-color-picker
                  v-model="baseAttr.stroke"
                  @change="(value: any) => changeCommon('stroke', value)"
                  show-alpha
                />
              </div>
            </div>
          </el-col>
          <el-col flex="1">
            <InputNumber
              v-model="baseAttr.strokeWidth"
              @on-change="(value) => changeCommon('strokeWidth', value)"
              :append="$t('editor.width')"
              :min="0"
            ></InputNumber>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const { isOne, isMatchType } = useSelect(['i-text'])
const editorStore = useEditorStore()
const update = getCurrentInstance()
const baseAttr: any = reactive({
  text: '',
  strokeWidth: 1,
  stroke: '',
  showPathAttr: false
})
const getObjectAttr = (e?: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObject()
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
const changeCommon = (key: any, value: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    baseAttr[key] = value
    if (key === 'text') {
      activeObject.set(key, value)
    } else {
      const path = activeObject.get('path')
      path.set(key, value)
    }
    editorStore.canvas?.renderAll()
  }
}
const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}
onMounted(() => {
  nextTick(() => {
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
