<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2023-11-06 00:58:57
 * @Description: 插入SVG元素
-->

<template>
  <div class="inline-block">
    <Dropdown transfer-class-name="fix" @on-click="insertTypeHand">
      <a href="javascript:void(0)">
        {{ $t('insertFile.insert') }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu>
          <!-- 图片 -->
          <DropdownItem name="insertImg">{{ $t('insertFile.insert_picture') }}</DropdownItem>
          <!-- SVG -->
          <DropdownItem name="insertSvg">{{ $t('insertFile.insert_SVG') }}</DropdownItem>
          <!-- SVG 字符串 -->
          <DropdownItem name="insertSvgStrModal">{{ $t('insertFile.insert_SVGStr') }}</DropdownItem>
          <!-- PSD -->
          <DropdownItem name="insertPSD">{{ $t('insertFile.insert_PSD') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <!-- 插入字符串svg元素 -->
    <Modal
      v-model="state.showModal"
      :title="$t('insertFile.modal_tittle')"
      @on-ok="insertTypeHand('insertSvgStr')"
      @on-cancel="state.showModal = false"
    >
      <Input
        v-model="state.svgStr"
        show-word-limit
        type="textarea"
        :placeholder="$t('insertFile.insert_SVGStr_placeholder')"
      />
    </Modal>
  </div>
</template>

<script name="ImportFile" lang="ts" setup>
import { getImgStr, selectFiles } from '@/utils/utils'
import useSelect from '@/hooks/select'
import { v4 as uuid } from 'uuid'
import { parsePSD } from '@/utils/psd'

const { fabric, canvasEditor }: any = useSelect()
const state = reactive({
  showModal: false,
  svgStr: ''
})
const HANDLEMAP: Record<string, any> = {
  // 插入图片
  insertImg: function () {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList: any) => {
      Array.from(fileList).forEach((item: any) => {
        getImgStr(item).then((file: any) => {
          insertImgFile(file)
        })
      })
    })
  },
  // 插入Svg
  insertSvg: function () {
    selectFiles({ accept: '.svg', multiple: true }).then((fileList: any) => {
      Array.from(fileList).forEach((item: any) => {
        getImgStr(item).then((file: any) => {
          insertSvgFile(file)
        })
      })
    })
  },
  // 插入SVG元素
  insertSvgStrModal: function () {
    state.svgStr = ''
    state.showModal = true
  },
  // 插入字符串元素
  insertSvgStr: function () {
    // @ts-ignore
    fabric.loadSVGFromString(state.svgStr, (objects, options) => {
      const item = fabric.util.groupSVGElements(objects, {
        ...options,
        name: 'defaultSVG',
        id: uuid()
      })
      canvasEditor.canvas.add(item).centerObject(item).renderAll()
    })
  },
  insertPSD: function () {
    selectFiles({ accept: '.psd', multiple: false }).then((fileList: any) => {
      Array.from(fileList).forEach(async (item: any) => {
        const data = await parsePSD(item)
        console.log('data')
        console.log(data)
      })
    })
  }
}

const insertTypeHand = (type: string) => {
  const cb = HANDLEMAP[type]
  cb && typeof cb === 'function' && cb()
}
// 插入图片文件
function insertImgFile(file: string) {
  if (!file) throw new Error('file is undefined')
  const imgEl = document.createElement('img')
  imgEl.src = file
  // 插入页面
  document.body.appendChild(imgEl)
  imgEl.onload = () => {
    // 创建图片对象
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: '图片1',
      scaleX: 0.2,
      scaleY: 0.2,
      left: 0,
      top: 0
    })
    // 设置缩放
    canvasEditor.canvas.add(imgInstance)
    canvasEditor.canvas.setActiveObject(imgInstance)
    canvasEditor.canvas.renderAll()
    // 删除页面中的图片元素
    imgEl.remove()
  }
}

// 插入文件元素
function insertSvgFile(svgFile: string) {
  if (!svgFile) throw new Error('file is undefined')
  //@ts-ignore
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid()
    })
    canvasEditor.canvas.add(item).centerObject(item).renderAll()
  })
}
</script>

<style scoped lang="less">
:deep(.ivu-select-dropdown) {
  z-index: 999;
}
</style>
