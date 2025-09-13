<template>
  <div class="box attr-item-box" v-if="isOne">
    <!-- <h3>阴影</h3> -->
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
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import { fabric } from 'fabric'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne } = useSelect()
const update = getCurrentInstance()

// 属性值
const baseAttr: any = reactive({
  shadow: {}
})

// 属性获取
const getObjectAttr = (e?: any) => {
  const activeObject = editorStore.canvas?.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    baseAttr.shadow = activeObject.get('shadow') || {}
  }
}

// 通用属性改变
const changeCommon = () => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow))
    editorStore.canvas?.renderAll()
  }
}

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
:deep(.el-color-picker__trigger) {
  width: 56px;
}
.label {
  margin-right: 4px;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
}
</style>
