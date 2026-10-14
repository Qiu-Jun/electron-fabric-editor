<template>
  <div class="box attr-item-box" v-if="isOne">
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.shadow.title') }}</h4>
    </el-divider>
    <!-- 通用属性 -->
    <el-row :gutter="12" style="margin-bottom: 10px">
      <el-col :span="12">
        <div class="f-center rounded-4px" style="background: #f8f8f9">
          <span class="label">{{ $t('editor.attrSetting.color') }}</span>
          <div class="content">
            <el-color-picker
              v-model="baseAttr.shadow.color"
              @change="changeCommon"
              alpha
            />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <InputNumber
          v-model="baseAttr.shadow.blur"
          :defaultValue="0"
          @on-change="changeCommon"
          :append="$t('editor.attrSetting.shadow.blur')"
          :min="0"
        ></InputNumber>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <InputNumber
          v-model="baseAttr.shadow.offsetX"
          :defaultValue="0"
          @on-change="changeCommon"
          :append="$t('editor.attrSetting.shadow.x')"
        ></InputNumber>
      </el-col>
      <el-col :span="12">
        <InputNumber
          v-model="baseAttr.shadow.offsetY"
          :defaultValue="0"
          @on-change="changeCommon"
          :append="$t('editor.attrSetting.shadow.y')"
        ></InputNumber>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { fabric } from 'fabric'
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()
const { isOne } = useAttrPanel({
  // 回显阴影属性
  getAttrs: (activeObject) => {
    baseAttr.shadow = activeObject.get('shadow') || {}
  }
})

// 属性值
const baseAttr: any = reactive({
  shadow: {}
})

// 阴影需重建实例才能生效
const changeCommon = () => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow))
    editorStore.canvas?.renderAll()
  }
}
</script>

<style scoped lang="scss">
.label {
  margin-right: 4px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
