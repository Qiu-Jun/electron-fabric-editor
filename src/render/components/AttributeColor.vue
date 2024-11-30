<template>
  <div class="box attr-item-box" v-if="isOne && selectType !== 'image' && selectType !== 'group'">
    <el-divider content-position="left"
      ><h4>{{ $t('editor.attrSetting.color') }}</h4></el-divider
    >
    <!-- 通用属性 -->
    <div class="bg-item">
      <el-popover width="280px" placement="top-start" effect="light" trigger="hover">
        <template #reference>
          <div class="color-bar" :style="{ background: baseAttr.fill }"></div>
        </template>

        <div style="width: 100%; box-sizing: border-box; padding: 10px">
          <ColorPicker
            v-model:value="baseAttr.fill"
            :modes="['渐变', '纯色']"
            @change="colorChange"
            @nativePick="dropColor"
          ></ColorPicker>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ColorPicker from '@/components/ColorPicker/index.vue'
import { useEditorStore } from '@/store/modules/editor'
import { fabric } from 'fabric'
import useSelect from '@/hooks/select'

const { selectType, isOne } = useSelect()
const editorStore = useEditorStore()
const update = getCurrentInstance()
const angleKey = 'gradientAngle'
// 属性值
const baseAttr: any = reactive({
  fill: ''
})

// 属性获取
const getObjectAttr = (e?: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject && isOne) {
    const fill = activeObject.get('fill')
    if (typeof fill === 'string') {
      baseAttr.fill = fill
    } else {
      baseAttr.fill = fabricGradientToCss(fill, activeObject)
    }
  }
}

const colorChange = (value: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    const color = String(value.color).replace('NaN', '')
    if (value.mode === '纯色') {
      activeObject.set('fill', color)
    } else if (value.mode === '渐变') {
      const currentGradient = cssToFabricGradient(
        toRaw(value.stops),
        activeObject.width,
        activeObject.height,
        value.angle
      )
      activeObject.set('fill', currentGradient, value.angle)
      activeObject.set(angleKey, value.angle)
    }
    editorStore.canvas?.renderAll()
  }
}

const dropColor = (value: any) => {
  colorChange(value)
}

const fabricGradientToCss = (val: any, activeObject: any) => {
  // 渐变类型
  if (!val) return
  const angle = activeObject.get(angleKey, val.degree)
  const colorStops = val.colorStops.map((item: any) => {
    return item.color + ' ' + item.offset * 100 + '%'
  })
  return `linear-gradient(${angle}deg, ${colorStops})`
}
// css转Fabric渐变
const cssToFabricGradient = (stops: any, width: number, height: number, angle: any) => {
  const gradAngleToCoords = (paramsAngle: any) => {
    const anglePI = -parseInt(paramsAngle, 10) * (Math.PI / 180)
    return {
      x1: Math.round(50 + Math.sin(anglePI) * 50) / 100,
      y1: Math.round(50 + Math.cos(anglePI) * 50) / 100,
      x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100,
      y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100
    }
  }

  const angleCoords = gradAngleToCoords(angle)
  return new fabric.Gradient({
    type: 'linear',
    gradientUnits: 'pencentage', // pixels or pencentage 像素 或者 百分比
    coords: {
      x1: angleCoords.x1 * width,
      y1: angleCoords.y1 * height,
      x2: angleCoords.x2 * width,
      y2: angleCoords.y2 * height
    },
    colorStops: [...stops]
  })
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
.color-bar {
  border: 2px solid #f6f7f9;
  @apply w-full h-30px cursor-pointer;
}
</style>
