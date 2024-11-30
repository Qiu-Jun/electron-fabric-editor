<template>
  <div class="box-border p-10px">
    <el-divider content-position="left">{{
      $t('editor.common_elements')
    }}</el-divider>
    <div class="tool-box">
      <span @click="() => addText()" :draggable="true" @dragend="addText">
        <SvgIcon extClass="text-20px" color="#333" icon="tool-text" />
      </span>
      <span @click="() => addTextBox()" :draggable="true" @dragend="addTextBox">
        <SvgIcon extClass="text-20px" color="#333" icon="tool-textBox" />
      </span>
      <span @click="() => addRect()" :draggable="true" @dragend="addRect">
        <SvgIcon extClass="text-20px" color="#333" icon="tool-rect" />
      </span>
      <span @click="() => addCircle()" :draggable="true" @dragend="addCircle">
        <SvgIcon extClass="text-20px" color="#333" icon="tool-circle" />
      </span>
      <span
        @click="() => addTriangle()"
        :draggable="true"
        @dragend="addTriangle"
      >
        <SvgIcon extClass="text-20px" color="#333" icon="tool-triangle" />
      </span>
      <!-- 多边形按钮 -->
      <span @click="() => addPolygon()" :draggable="true" @dragend="addPolygon">
        <SvgIcon extClass="text-20px" color="#333" icon="tool-polygon" />
      </span>
    </div>
    <el-divider content-position="left">{{
      $t('editor.draw_elements')
    }}</el-divider>
    <div class="tool-box">
      <span
        @click="drawingLineModeSwitch('line')"
        :class="state.isDrawingLineMode && state.lineType === 'line' && 'bg'"
      >
        <SvgIcon extClass="text-20px" color="#333" icon="tool-draw1" />
      </span>
      <span
        @click="drawingLineModeSwitch('arrow')"
        :class="state.isDrawingLineMode && state.lineType === 'arrow' && 'bg'"
      >
        <SvgIcon extClass="text-20px" color="#333" icon="tool-draw2" />
      </span>
      <span
        @click="drawingLineModeSwitch('thinTailArrow')"
        :class="
          state.isDrawingLineMode && state.lineType === 'thinTailArrow' && 'bg'
        "
      >
        <SvgIcon extClass="text-20px" color="#333" icon="tool-draw3" />
      </span>
      <span
        @click="drawPolygon"
        :class="state.isDrawingLineMode && state.lineType === 'polygon' && 'bg'"
      >
        <SvgIcon extClass="text-20px" color="#333" icon="tool-draw4" />
      </span>
      <!-- <span
        @click="drawPathText"
        :class="
          state.isDrawingLineMode && state.lineType === 'pathText' && 'bg'
        "
      >
        <SvgIcon
          :style="{ width: '20px', height: '20px' }"
          name="editor-tumblr"
        />
      </span> -->
      <span
        @click="freeDraw"
        :class="
          state.isDrawingLineMode && state.lineType === 'freeDraw' && 'bg'
        "
      >
        <SvgIcon extClass="text-20px" icon="editor-brush" />
      </span>
    </div>
    <el-divider content-position="left">{{ $t('editor.code_img') }}</el-divider>
    <div class="tool-box">
      <span @click="editorStore.editor.addQrCode">
        <SvgIcon extClass="text-20px" color="#333" icon="tool-qrCode" />
      </span>
      <span @click="editorStore.editor.addBarcode">
        <SvgIcon extClass="text-20px" color="#333" icon="tool-barCode" />
      </span>
    </div>
  </div>
</template>

<script setup name="Tools">
import { getPolygonVertices } from '@/utils/math'
import { useI18n } from 'vue-i18n'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
const LINE_TYPE = {
  polygon: 'polygon',
  freeDraw: 'freeDraw',
  pathText: 'pathText'
}
// 默认属性
const defaultPosition = { shadow: '', fontFamily: 'arial' }

const { t } = useI18n()
const state = reactive({
  isDrawingLineMode: false,
  lineType: false
})

const addText = (event) => {
  cancelDraw()
  const text = new fabric.IText(t('everything_is_fine'), {
    ...defaultPosition,
    fontSize: 80,
    fill: '#000000FF'
  })

  editorStore.editor.addBaseType(text, { center: true, event })
}

const addTextBox = (event) => {
  cancelDraw()
  const text = new fabric.Textbox(t('everything_goes_well'), {
    ...defaultPosition,
    splitByGrapheme: true,
    width: 400,
    fontSize: 80,
    fill: '#000000FF'
  })

  editorStore.editor.addBaseType(text, { center: true, event })
}

const addTriangle = (event) => {
  cancelDraw()
  const triangle = new fabric.Triangle({
    ...defaultPosition,
    width: 400,
    height: 400,
    fill: '#92706BFF',
    name: '三角形'
  })
  editorStore.editor.addBaseType(triangle, { center: true, event })
}

const addPolygon = (event) => {
  cancelDraw()
  const polygon = new fabric.Polygon(getPolygonVertices(5, 200), {
    ...defaultPosition,
    fill: '#CCCCCCFF',
    name: '多边形'
  })
  polygon.set({
    // 创建完设置宽高，不然宽高会变成自动的值
    width: 400,
    height: 400,
    // 关闭偏移
    pathOffset: {
      x: 0,
      y: 0
    }
  })
  editorStore.editor.addBaseType(polygon, { center: true, event })
}

const addCircle = (event) => {
  cancelDraw()
  const circle = new fabric.Circle({
    ...defaultPosition,
    radius: 150,
    fill: '#57606BFF',
    // id: uuid(),
    name: '圆形'
  })
  editorStore.editor.addBaseType(circle, { center: true, event })
}

const addRect = (event) => {
  cancelDraw()
  const rect = new fabric.Rect({
    ...defaultPosition,
    fill: '#F57274FF',
    width: 400,
    height: 400,
    name: '矩形'
  })

  editorStore.editor.addBaseType(rect, { center: true, event })
}
const drawPolygon = () => {
  const onEnd = () => {
    state.lineType = false
    state.isDrawingLineMode = false
    ensureObjectSelEvStatus(!state.isDrawingLineMode, !state.isDrawingLineMode)
  }
  if (state.lineType !== LINE_TYPE.polygon) {
    endConflictTools()
    endDrawingLineMode()
    state.lineType = LINE_TYPE.polygon
    state.isDrawingLineMode = true
    editorStore.editor.beginDrawPolygon(onEnd)
    editorStore.editor.endDraw()
    ensureObjectSelEvStatus(!state.isDrawingLineMode, !state.isDrawingLineMode)
  } else {
    editorStore.editor.discardPolygon()
  }
}

// const drawPathText = () => {
//   if (state.lineType === LINE_TYPE.pathText) {
//     state.lineType = false
//     state.isDrawingLineMode = false
//     editorStore.editor.endTextPathDraw()
//   } else {
//     endConflictTools()
//     endDrawingLineMode()
//     state.lineType = LINE_TYPE.pathText
//     state.isDrawingLineMode = true
//     editorStore.editor.startTextPathDraw()
//   }
// }

const freeDraw = () => {
  if (state.lineType === LINE_TYPE.freeDraw) {
    editorStore.editor.endDraw()
    state.lineType = false
    state.isDrawingLineMode = false
  } else {
    endConflictTools()
    endDrawingLineMode()
    state.lineType = LINE_TYPE.freeDraw
    state.isDrawingLineMode = true
    editorStore.editor.startDraw({ width: 20 })
  }
}

const endConflictTools = () => {
  editorStore.editor.discardPolygon()
  editorStore.editor.endDraw()
  editorStore.editor.endTextPathDraw()
}
const endDrawingLineMode = () => {
  state.isDrawingLineMode = false
  state.lineType = ''
  editorStore.editor.setMode(state.isDrawingLineMode)
  editorStore.editor.setLineType(state.lineType)
}
const drawingLineModeSwitch = (type) => {
  if (
    [LINE_TYPE.polygon, LINE_TYPE.freeDraw, LINE_TYPE.pathText].includes(
      state.lineType
    )
  ) {
    endConflictTools()
  }
  if (state.lineType === type) {
    state.isDrawingLineMode = false
    state.lineType = ''
  } else {
    state.isDrawingLineMode = true
    state.lineType = type
  }

  console.log(state.isDrawingLineMode, type, 'element')
  editorStore.editor.setMode(state.isDrawingLineMode)
  editorStore.editor.setLineType(type)
  ensureObjectSelEvStatus(!state.isDrawingLineMode, !state.isDrawingLineMode)
}

const ensureObjectSelEvStatus = (evented, selectable) => {
  editorStore.editor.canvas.forEachObject((obj) => {
    if (obj.id !== 'workspace') {
      obj.selectable = selectable
      obj.evented = evented
    }
  })
}

// 退出绘制状态
const cancelDraw = () => {
  if (!state.isDrawingLineMode) return
  state.isDrawingLineMode = false
  state.lineType = ''
  editorStore.editor.setMode(false)
  endConflictTools()
  ensureObjectSelEvStatus(true, true)
}

onDeactivated(() => {
  cancelDraw()
})
</script>

<style lang="scss" scoped>
.tool-box {
  display: flex;
  justify-content: space-around;
  span {
    flex: 1;
    text-align: center;
    padding: 5px 0;
    background: #f6f6f6;
    margin-left: 2px;
    cursor: pointer;
    &:hover {
      background: #edf9ff;
      svg {
        fill: #2d8cf0;
      }
    }
  }
  .bg {
    background: #d8d8d8;

    &:hover {
      svg {
        fill: #2d8cf0;
      }
    }
  }
}
.img {
  width: 20px;
}
</style>
