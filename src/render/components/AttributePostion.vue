<template>
  <div class="box attr-item-box" v-if="isOne">
    <!-- <h3>位置信息</h3> -->
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
            v-model="baseAttr.left"
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
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const update = getCurrentInstance()

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
const { isMatchType, isOne } = useSelect(baseType)
// 属性值
const baseAttr = reactive<Record<string, any>>({
  opacity: 0,
  angle: 0,
  left: 0,
  top: 0,
  rx: 0,
  ry: 0
})

// 属性获取
const getObjectAttr = (e?: any) => {
  const activeObject = editorStore.canvas?.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  //@ts-ignore
  if (activeObject && isMatchType) {
    baseAttr.opacity = (activeObject.get('opacity') ?? 0) * 100
    baseAttr.left = activeObject.get('left')
    baseAttr.top = activeObject.get('top')
    baseAttr.angle = activeObject.get('angle') || 0
  }
}

// 通用属性改变
const changeCommon = (key: any, value: any) => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    // 透明度特殊转换
    if (key === 'opacity') {
      activeObject && activeObject.set(key, value / 100)
      editorStore.canvas?.renderAll()
      return
    }
    // 旋转角度适配
    if (key === 'angle') {
      activeObject.rotate(value)
      editorStore.canvas?.renderAll()
      return
    }
    activeObject && activeObject.set(key, value)
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

<style lang="scss" scoped>
.number-warp {
  background: #f6f7f9;
  padding: 0 15px 0 10px;
  @apply w-full box-border flex justify-start items-center rounded-5px mb-10px relative z-1;
  span {
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
    @apply w-56px inline-block;
  }
}
</style>
