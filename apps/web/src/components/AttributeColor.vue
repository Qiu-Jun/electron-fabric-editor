<template>
  <div
    class="box attr-item-box"
    v-if="isOne && selectType !== 'image' && selectType !== 'group'"
  >
    <el-divider content-position="left"
      ><h4>{{ $t('editor.attrSetting.color') }}</h4></el-divider
    >
    <!-- 通用属性 -->
    <div class="bg-item">
      <el-popover width="340px" effect="light" trigger="hover" @show="onShow">
        <template #reference>
          <div class="color-bar" :style="{ background: baseAttr.fill }"></div>
        </template>

        <ColorPicker
          v-if="showColorPicker"
          v-model:value="baseAttr.fill"
          @change="colorChange"
        ></ColorPicker>
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ColorPicker } from 'color-gradient-picker-vue3'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/modules/editor'
import useAttrPanel from '@/hooks/useAttrPanel'

const editorStore = useEditorStore()
const angleKey = 'gradientAngle'
// 属性值
const baseAttr: any = reactive({
  fill: ''
})

const showColorPicker = ref(false)
const onShow = () => {
  nextTick(() => {
    showColorPicker.value = true
  })
}

const { isOne, selectType } = useAttrPanel({
  // 回显填充色,渐变色转为 css 渐变展示
  getAttrs: (activeObject: any) => {
    const fill = activeObject.get('fill')
    if (typeof fill === 'string') {
      baseAttr.fill = fill
    } else {
      baseAttr.fill = fabricGradientToCss(fill, activeObject)
    }
  }
})

const colorChange = (value: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    const { color, mode, gradientColors, degrees } = value
    if (mode === 'solid') {
      activeObject.set('fill', color)
    } else if (mode === 'gradient') {
      const currentGradient = cssToFabricGradient(
        gradientColors.map((i: any) => ({
          color: i.color,
          offset: i.left / 100
        })),
        activeObject.width,
        activeObject.height,
        degrees
      )
      activeObject.set('fill', currentGradient, degrees)
      activeObject.set(angleKey, degrees)
    }
    editorStore.canvas?.renderAll()
  }
}

// fabric 渐变转 css 渐变
const fabricGradientToCss = (val: any, activeObject: any) => {
  if (!val) return
  const angle = activeObject.get(angleKey) ?? 0
  const colorStops = val.colorStops.map((item: any) => {
    return item.color + ' ' + item.offset * 100 + '%'
  })
  return `linear-gradient(${angle}deg, ${colorStops})`
}

// css 转 Fabric 渐变
const cssToFabricGradient = (
  stops: any,
  width: number,
  height: number,
  angle: any
) => {
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
  // 坐标按对象像素计算
  return new fabric.Gradient({
    type: 'linear',
    gradientUnits: 'pixels',
    coords: {
      x1: angleCoords.x1 * width,
      y1: angleCoords.y1 * height,
      x2: angleCoords.x2 * width,
      y2: angleCoords.y2 * height
    },
    colorStops: [...stops]
  })
}
</script>

<style scoped lang="scss">
.color-bar {
  border: 2px solid #f6f7f9;
  @apply w-full h-30px cursor-pointer;
}
</style>
