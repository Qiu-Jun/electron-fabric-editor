<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-05 23:05:23
 * @LastEditTime: 2024-11-29 11:14:28
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\components\AttributeRounded.vue
-->
<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
    <!-- <h3>圆角</h3> -->
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.radius.name') }}</h4>
    </el-divider>
    <!-- 通用属性 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18" flex="1">
          <el-form :label-width="40" class="form-wrap">
            <el-form-item :label="$t('editor.attrSetting.radius.radius')">
              <el-slider
                v-model="baseAttr.rx"
                :max="300"
                @input="(value: any) => changeCommon(value)"
              ></el-slider>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" flex="1">
          <InputNumber
            v-model="baseAttr.rx"
            :min="0"
            :max="300"
            @on-change="(value) => changeCommon(value)"
          ></InputNumber>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const update = getCurrentInstance()

// 矩形元素
const { isOne, isMatchType } = useSelect(['rect'])
// 属性值
const baseAttr = reactive({
  rx: 0,
  ry: 0
})

// 属性获取
const getObjectAttr = (e?: any) => {
  const activeObject = editorStore.canvas?.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    baseAttr.rx = activeObject.get('rx')
    baseAttr.ry = activeObject.get('ry')
  }
}

// 通用属性改变
const changeCommon = (value) => {
  const activeObject = editorStore.canvas.getActiveObjects()[0]
  if (activeObject) {
    activeObject.set('ry', value)
    activeObject.set('rx', value)
    editorStore.canvas.renderAll()
  }
}

const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}

onMounted(() => {
  nextTick(() => {
    // 获取圆角数据
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

<style scoped lang="scss"></style>
