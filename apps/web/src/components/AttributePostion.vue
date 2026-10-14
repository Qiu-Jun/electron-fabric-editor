<template>
  <div class="box attr-item-box" v-if="isOne">
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.position.title') }}</h4>
    </el-divider>
    <!-- 通用属性 -->
    <div v-show="isMatchType">
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col :span="12">
          <InputNumber
            v-model="baseAttr.left"
            :append="$t('editor.attrSetting.position.x')"
            @on-change="(value) => changeCommon('left', value)"
          />
        </el-col>
        <el-col :span="12">
          <InputNumber
            v-model="baseAttr.top"
            :append="$t('editor.attrSetting.position.y')"
            @on-change="(value) => changeCommon('top', value)"
          />
        </el-col>
      </el-row>

      <div class="number-warp">
        <span>{{ $t('editor.attrSetting.position.rotate') }}</span>
        <el-slider
          v-model="baseAttr.angle"
          :max="360"
          @input="(value: any) => changeCommon('angle', value)"
        ></el-slider>
      </div>

      <div class="number-warp">
        <span>{{ $t('editor.attrSetting.position.opacity') }}</span>
        <el-slider
          v-model="baseAttr.opacity"
          @input="(value: any) => changeCommon('opacity', value)"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()

// 可修改的元素
const baseType = [
  'text',
  'i-text',
  'textbox',
  'rect',
  'circle',
  'triangle',
  'polygon',
  'image',
  'group',
  'line',
  'arrow',
  'thinTailArrow'
]
const { isOne, isMatchType } = useAttrPanel({
  matchTypes: baseType,
  // 回显位置属性,透明度换算为百分比
  getAttrs: (activeObject) => {
    baseAttr.opacity = (activeObject.get('opacity') ?? 0) * 100
    baseAttr.left = activeObject.get('left')
    baseAttr.top = activeObject.get('top')
    baseAttr.angle = activeObject.get('angle') || 0
  }
})

// 属性值
const baseAttr = reactive<Record<string, any>>({
  opacity: 0,
  angle: 0,
  left: 0,
  top: 0
})

// 通用属性改变
const changeCommon = (key: string, value: number) => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (!activeObject) return
  // 透明度特殊转换
  if (key === 'opacity') {
    activeObject.set(key, value / 100)
    editorStore.canvas?.renderAll()
    return
  }
  // 旋转角度适配
  if (key === 'angle') {
    activeObject.rotate(value)
    editorStore.canvas?.renderAll()
    return
  }
  activeObject.set(key, value)
  editorStore.canvas?.renderAll()
}
</script>

<style lang="scss" scoped>
.number-warp {
  // 旋转/透明度标签较宽,在全局基础上加宽
  span {
    @apply w-56px;
  }
}
</style>
