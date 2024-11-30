<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-10-03 11:37:38
 * @LastEditTime: 2024-11-23 16:51:53
 * @LastEditors: June
-->
<template>
  <div class="w-full h-full overflow-y-auto">
    <!-- 插入 -->
    <section>
      <div class="h-36px leading-36px font-bold ml-10px">
        {{ $t('editor.insert.title') }}
      </div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-88px ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="file in filesList"
          :key="file.type"
          @click="handleInsertFile(file.type)"
        >
          <SvgIcon extClass="text-24px" :icon="file.icon" color="#333" />
          <span class="text-12px mt-10px">{{ $t(file.name) }}</span>
        </li>
      </ul>
    </section>
    <!-- 文本 -->
    <section class="-mt-10px">
      <div class="h-36px leading-36px font-bold ml-10px">
        {{ $t('editor.text.title') }}
      </div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-88px ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="text in textList"
          :key="text.type"
          @click="handleAddText(text.type)"
        >
          <SvgIcon extClass="text-24px" :icon="text.icon" color="#333" />
          <span class="text-12px mt-10px">{{ $t(text.name) }}</span>
        </li>
      </ul>
    </section>
    <!-- 形状 -->
    <section class="-mt-10px">
      <div class="h-36px leading-36px font-bold ml-10px">
        {{ $t('editor.shape.title') }}
      </div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-full ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="shape in shapeList"
          :key="shape.type"
          @click="handleAddShape(shape.type)"
        >
          <div class="w-24px h-24px" v-html="shape.icon"></div>
        </li>
      </ul>
    </section>
    <section class="-mt-10px">
      <div class="h-36px leading-36px font-bold ml-10px">
        {{ $t('editor.draw.title') }}
      </div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-full ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          :class="{
            drawActive: drawItem.type === curDrawType
          }"
          v-for="drawItem in drawList"
          :key="drawItem.type"
          @click="handleDraw(drawItem.type)"
        >
          <SvgIcon extClass="text-20px" :icon="drawItem.icon" />
        </li>
      </ul>
    </section>
    <!-- 条码图片 -->
    <section class="-mt-10px">
      <div class="h-36px leading-36px font-bold ml-10px">
        {{ $t('editor.codes.title') }}
      </div>
      <ul class="flex justify-start items-center flex-wrap min-h-40px">
        <li
          class="f-center flex-col p-10px select-none cursor-pointer w-88px h-full ml-10px mb-10px bg-#f1f2f4 rounded-12px editor-item"
          v-for="code in codesList"
          :key="code.type"
          @click="handleAddCode(code.type)"
        >
          <div class="w-24px h-24px" v-html="code.icon"></div>
        </li>
      </ul>
    </section>

    <!-- 新建设计 -->
    <ModalSize
      title="新建设计"
      ref="modalSizeRef"
      @set="customSizeCreate"
    ></ModalSize>
  </div>
</template>

<script lang="ts" setup>
import {
  textList,
  shapeList,
  codesList,
  filesList,
  drawList
} from '@/constants/editor'
import { texts, shapes, codes, files, DrawTypes } from '@/enums/editor'
import { debounce } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'
import { fabric } from 'fabric'
import { getPolygonVertices } from '@/utils/math'
import { Utils } from '@/lib/core'
import { v4 as uuid } from 'uuid'
import ModalSize from '@/components/ModalSize.vue'

const { getImgStr, selectFiles } = Utils
const editorStore = useEditorStore()

const customSizeCreate = async (w: number, h: number) => {
  editorStore.editor.clear()
  editorStore.editor.setSize(w, h)
  ElMessage.success('创建成功')
}

// 默认属性
const defaultPosition = { shadow: '', fontFamily: 'arial' }

const modalSizeRef = ref()
const handleInsertFile = debounce(async function (type: files) {
  const loading = ElLoading.service({
    lock: true,
    body: true
  })
  try {
    switch (type) {
      case files.design:
        loading.close()
        modalSizeRef.value?.showSetSize()
        break
      case files.img:
        selectFiles({ accept: 'image/*', multiple: true }).then(
          (fileList: any) => {
            Array.from(fileList).forEach((item: any) => {
              getImgStr(item).then((file: any) => {
                insertImgFile(file)
              })
            })
          }
        )
        break
      case files.svg:
        selectFiles({ accept: '.svg', multiple: true }).then(
          (fileList: any) => {
            Array.from(fileList).forEach((item: any) => {
              getImgStr(item).then((file: any) => {
                insertSvgFile(file)
              })
            })
          }
        )
        break
      case files.json:
        editorStore.editor.insert()
        break
      case files.psd:
        loading.close()
        await editorStore.editor.insertPSD()
        break
      default:
        break
    }
    loading.close()
  } catch (err) {
    loading.close()
  }
}, 250)

const handleAddText = debounce(function (type: texts) {
  let text: fabric.IText | null
  switch (type) {
    case texts.h1:
      text = new fabric.Textbox('双击编辑标题', {
        ...defaultPosition,
        fontWeight: 'bold',
        fontSize: 80,
        fill: '#000000'
      })
      break
    case texts.h2:
      text = new fabric.Textbox('双击编辑标题', {
        ...defaultPosition,
        fontWeight: 'bold',
        fontSize: 60,
        fill: '#000000'
      })
      break
    case texts.normal:
      text = new fabric.Textbox('双击编辑标题', {
        ...defaultPosition,
        fontSize: 48,
        fill: '#000000'
      })
      break
    default:
      break
  }
  text! && editorStore.editor.addBaseType(text, { center: true })
}, 250)

const handleAddShape = debounce(function (type: shapes) {
  switch (type) {
    case shapes.react:
      const rect = new fabric.Rect({
        ...defaultPosition,
        fill: '#F57274FF',
        width: 400,
        height: 400,
        name: '矩形'
      })
      editorStore.editor.addBaseType(rect, { center: true })
      break
    case shapes.triangle:
      const triangle = new fabric.Triangle({
        ...defaultPosition,
        width: 400,
        height: 400,
        fill: '#92706BFF',
        name: '三角形'
      })
      editorStore.editor.addBaseType(triangle, { center: true })
      break
    case shapes.around:
      const circle = new fabric.Circle({
        ...defaultPosition,
        radius: 150,
        fill: '#57606BFF',
        // id: uuid(),
        name: '圆形'
      })
      editorStore.editor.addBaseType(circle, { center: true })
      break
    case shapes.polygon:
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
        // @ts-ignore
        pathOffset: {
          x: 0,
          y: 0
        }
      })
      editorStore.editor.addBaseType(polygon, { center: true })
      break
    case shapes.line:
      const line = new fabric.Line([100, 100, 10, 10], {
        ...defaultPosition,
        stroke: '#333',
        fill: '#333',
        name: '直线'
      })
      editorStore.editor.addBaseType(line, { center: true })
      break
    default:
      break
  }
}, 250)

const handleAddCode = debounce(function (type: codes) {
  switch (type) {
    case codes.qrcode:
      editorStore.editor.addQrCode()
      break
    case codes.barCode:
      editorStore.editor.addBarcode()
      break
    default:
      break
  }
}, 250)

// 绘制元素相关
const curDrawType = ref<DrawTypes | ''>('')
const isDrawingLineMode = ref(false)
const state = reactive({
  isDrawingLineMode: false,
  lineType: false
})
const handleDraw = debounce(function (type: DrawTypes) {
  if (unref(curDrawType) === type) {
    curDrawType.value = ''
    isDrawingLineMode.value = false
    type === DrawTypes.freeDraw && editorStore.editor.endDraw()
    type === DrawTypes.polygon && editorStore.editor.discardPolygon()
    return
  } else {
    isDrawingLineMode.value = true
    curDrawType.value = type
  }

  switch (type) {
    case DrawTypes.line:
      drawingLineModeSwitch()
      break
    case DrawTypes.arrow:
      drawingLineModeSwitch()
      break
    case DrawTypes.thinTailArrow:
      drawingLineModeSwitch()
      break
    case DrawTypes.freeDraw:
      endConflictTools()
      endDrawingLineMode()
      curDrawType.value = type
      editorStore.editor.startDraw({ width: 20 })
      break
    default:
      break
  }
}, 250)

function drawingLineModeSwitch() {
  const _curDrawType = unref(curDrawType)
  const _isDrawingLineMode = unref(isDrawingLineMode)
  editorStore.editor.setMode(_isDrawingLineMode)
  editorStore.editor.setLineType(_curDrawType)
}
function endConflictTools() {
  editorStore.editor.discardPolygon()
  editorStore.editor.endDraw()
  editorStore.editor.endTextPathDraw()
}
function endDrawingLineMode() {
  isDrawingLineMode.value = false
  curDrawType.value = ''
  editorStore.editor.setMode(unref(isDrawingLineMode))
  editorStore.editor.setLineType(unref(isDrawingLineMode))
}

// 插入图片文件
function insertImgFile(file: any) {
  if (!file) throw new Error('file is undefined')
  const imgEl = document.createElement('img')
  imgEl.src = file
  // 插入页面
  document.body.appendChild(imgEl)
  imgEl.onload = async () => {
    const imgItem = await editorStore.editor.createImgByElement(imgEl)
    editorStore.editor.addBaseType(imgItem, {
      scale: true
    })
    imgEl.remove()
  }
}

// 插入文件元素
function insertSvgFile(svgFile: any) {
  if (!svgFile) throw new Error('file is undefined')
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid()
    })
    editorStore.editor.addBaseType(item, {
      scale: true
    })
  })
}

// 退出绘制状态
const cancelDraw = () => {
  if (!unref(isDrawingLineMode)) return
  isDrawingLineMode.value = false
  curDrawType.value = ''
  editorStore.editor.setMode(false)
  endConflictTools()
}

onDeactivated(() => {
  console.log('onDeactivated, 触发')
  cancelDraw()
})
</script>

<style lang="scss" setup>
.drawActive {
  @apply bg-[var(--el-color-primary)] text-#fff;
}
</style>
