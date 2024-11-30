<template>
  <div class="w-full" v-if="isOne">
    <!-- 通用属性 -->
    <div v-show="isMatchType">
      <el-ivider plain orientation="left">{{ $t('attributes.exterior') }}</el-ivider>
      <!-- 多边形边数 -->
      <el-row v-if="selectType === 'polygon'" :gutter="12">
        <el-col flex="0.5">
          <InputNumber
            v-model="baseAttr.points.length"
            :min="3"
            :max="30"
            @on-change="changeEdge"
            append="边数"
          ></InputNumber>
        </el-col>
      </el-row>
      <!-- 颜色 -->
      <colorSelector
        :color="baseAttr.fill"
        @change="(value) => changeCommon('fill', value)"
      ></colorSelector>
    </div>
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select'
import colorSelector from '@/components/colorSelector.vue'
import { getPolygonVertices } from '@/utils/math'
import InputNumber from '@/components/InputNumber/InputNumber.vue'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
// 通用元素
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

const update = getCurrentInstance()
const { selectType, isOne, isMatchType } = useSelect(baseType)

const fontsList = ref([])
editorStore.editor.getFontList().then((list) => {
  fontsList.value = list
})

// 文字元素
// 通用属性
const baseAttr = reactive({
  id: '',
  opacity: 0,
  angle: 0,
  fill: '#fff',
  left: 0,
  top: 0,
  strokeWidth: 0,
  strokeDashArray: [],
  stroke: '#fff',
  shadow: {
    color: '#fff',
    blur: 0,
    offsetX: 0,
    offsetY: 0
  },
  points: {},
  linkData: [null, null]
})

const getObjectAttr = (e) => {
  const activeObject = editorStore.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    // base
    baseAttr.fill = activeObject.get('fill')
    baseAttr.points = activeObject.get('points') || {}
  }
}

const selectCancel = () => {
  baseAttr.fill = ''
  update?.proxy?.$forceUpdate()
}

const init = () => {
  // 获取字体数据
  getObjectAttr()
  editorStore.editor?.on('selectCancel', selectCancel)
  editorStore.editor?.on('selectOne', getObjectAttr)
  editorStore.canvas?.on('object:modified', getObjectAttr)
}

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = editorStore.canvas.getActiveObjects()[0]
  activeObject && activeObject.set(key, value)
  editorStore.canvas.renderAll()
}

// 修改边数
const changeEdge = (value) => {
  const activeObjects = editorStore.canvas.getActiveObjects()
  if (!activeObjects || !activeObjects.length) return
  activeObjects[0].set(
    'points',
    getPolygonVertices(value, Math.min(activeObjects[0].width, activeObjects[0].height) / 2)
  )
  editorStore.canvas.requestRenderAll()
}

onMounted(init)

onBeforeUnmount(() => {
  editorStore.editor?.off('selectCancel', selectCancel)
  editorStore.editor?.off('selectOne', getObjectAttr)
  editorStore.canvas?.off('object:modified', getObjectAttr)
})
</script>
