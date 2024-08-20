<template>
  <div class="f-center">
    <el-dropdown transfer-class-name="fix" @command="insertTypeHand">
      <el-button link type="primary">
        {{ $t('insertFile.insert') }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 图片 -->
          <el-dropdown-item command="insertImg">{{
            $t('insertFile.insert_picture')
          }}</el-dropdown-item>
          <!-- SVG -->
          <el-dropdown-item command="insertSvg">{{ $t('insertFile.insert_SVG') }}</el-dropdown-item>
          <!-- SVG 字符串 -->
          <el-dropdown-item command="insertSvgStrModal">{{
            $t('insertFile.insert_SVGStr')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 插入字符串svg元素 -->
    <el-dialog v-model="state.showModal" :title="$t('insertFile.modal_tittle')">
      <el-input
        v-model="state.svgStr"
        show-word-limit
        type="textarea"
        :placeholder="$t('insertFile.insert_SVGStr_placeholder')"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.showModal = false">取消</el-button>
          <el-button type="primary" @click="insertTypeHand('insertSvgStr')"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script name="ImportFile" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { Utils } from '@/lib/core'
import useSelect from '@/hooks/select'
import { v4 as uuid } from 'uuid'

const { getImgStr, selectFiles } = Utils

const { fabric, canvasEditor } = useSelect()
const state = reactive({
  showModal: false,
  svgStr: ''
})
const HANDLEMAP = {
  // 插入图片
  insertImg: function () {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertImgFile(file)
        })
      })
    })
  },
  // 插入Svg
  insertSvg: function () {
    selectFiles({ accept: '.svg', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
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
    fabric.loadSVGFromString(state.svgStr, (objects, options) => {
      const item = fabric.util.groupSVGElements(objects, {
        ...options,
        name: 'defaultSVG'
      })
      canvasEditor.addBaseType(item, {
        scale: true
      })
      state.showModal = false
    })
  }
}

const insertTypeHand = (type) => {
  const cb = HANDLEMAP[type]
  cb && typeof cb === 'function' && cb()
}
// 插入图片文件
function insertImgFile(file) {
  if (!file) throw new Error('file is undefined')
  const imgEl = document.createElement('img')
  imgEl.src = file
  // 插入页面
  document.body.appendChild(imgEl)
  imgEl.onload = async () => {
    const imgItem = await canvasEditor.createImgByElement(imgEl)
    canvasEditor.addBaseType(imgItem, {
      scale: true
    })
    imgEl.remove()
  }
}

// 插入文件元素
function insertSvgFile(svgFile) {
  if (!svgFile) throw new Error('file is undefined')
  fabric.loadSVGFromURL(svgFile, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      name: 'defaultSVG',
      id: uuid()
    })
    canvasEditor.addBaseType(item, {
      scale: true
    })
  })
}
</script>
