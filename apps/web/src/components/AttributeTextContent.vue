<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.text.content') }}</h4>
    </el-divider>

    <el-form :label-width="70" class="form-wrap">
      <el-form-item :label="$t('editor.attrSetting.text.content')">
        <el-input
          v-model="baseAttr.text"
          @change="changeCommon('text', baseAttr.text)"
          size="small"
        />
      </el-form-item>
    </el-form>

    <template v-if="baseAttr.showPathAttr">
      <el-divider content-position="left">
        <h4>{{ $t('editor.attrSetting.text.path') }}</h4>
      </el-divider>
      <div>
        <el-row :gutter="12">
          <el-col flex="1">
            <div class="ivu-col__box">
              <span class="label">{{ $t('editor.attrSetting.color') }}</span>
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
              :append="$t('editor.attrSetting.border.width')"
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
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()
const { isOne, isMatchType } = useAttrPanel({
  matchTypes: ['i-text'],
  // 回显文字内容,路径文字时额外回显描边
  getAttrs: (activeObject: any) => {
    if (!('text' in activeObject)) return
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
})

const baseAttr: any = reactive({
  text: '',
  strokeWidth: 1,
  stroke: '',
  showPathAttr: false
})

// 文字走对象属性,路径文字修改 path 描边
const changeCommon = (key: any, value: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    baseAttr[key] = value
    if (key === 'text') {
      activeObject.set(key, value)
    } else {
      const path = activeObject.get('path')
      path && path.set(key, value)
    }
    editorStore.canvas?.renderAll()
  }
}
</script>
