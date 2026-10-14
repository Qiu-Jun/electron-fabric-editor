<!--
 * @Author: June
 * @Description: 圆角属性面板
 * @Date: 2024-09-05 23:05:23
 * @LastEditTime: 2026-09-14 10:10:00
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\components\AttributeRounded.vue
-->
<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
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
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()
// 矩形元素
const { isOne, isMatchType } = useAttrPanel({
  matchTypes: ['rect'],
  // 回显圆角属性
  getAttrs: (activeObject) => {
    baseAttr.rx = activeObject.get('rx')
  }
})

// 属性值
const baseAttr = reactive({
  rx: 0
})

// 圆角修改时 rx 与 ry 保持一致
const changeCommon = (value: number) => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    activeObject.set({ rx: value, ry: value })
    editorStore.canvas?.renderAll()
  }
}
</script>
