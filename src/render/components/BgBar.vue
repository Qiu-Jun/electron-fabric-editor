<template>
  <div v-if="!isSelect">
    <div class="attr-item-box">
      <el-divider content-position="left">
        <h4>{{ $t('editor.bgSetting.color') }}</h4>
      </el-divider>
      <el-color-picker v-model="color" @change="setThisColor" show-alpha />
    </div>
    <div class="attr-item-box">
      <el-divider content-position="left">
        <h4>{{ $t('editor.bgSetting.colorMacthing') }}</h4>
      </el-divider>
      <div class="color-list">
        <template v-for="(item, i) in colorList" :key="item + i">
          <span :style="`background:${item}`" @click="setColor(item)"></span>
        </template>
      </div>
    </div>

    <div class="attr-item-box">
      <el-divider content-position="left">
        <h4>{{ $t('editor.bgSetting.bgImage') }}</h4>
      </el-divider>

      <div class="f-center">
        <el-button @click="handleRmoveBgImg">
          {{ $t('editor.bgSetting.removeBgImage') }}
        </el-button>
        <el-button @click="handleSetBgImg">
          {{ $t('editor.bgSetting.addBgImage') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'
import { Utils } from '@/lib/core'
import { debounce } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import useSelect from '@/hooks/select'

const { isSelect } = useSelect()
const editorStore = useEditorStore()
const { getImgStr, selectFiles } = Utils
const colorList = ref([
  '#5F2B63',
  '#B23554',
  '#F27E56',
  '#FCE766',
  '#86DCCD',
  '#E7FDCB',
  '#FFDC84',
  '#F57677',
  '#5FC2C7',
  '#98DFE5',
  '#C2EFF3',
  '#DDFDFD',
  '#9EE9D3',
  '#2FC6C8',
  '#2D7A9D',
  '#48466d',
  '#61c0bf',
  '#bbded6',
  '#fae3d9',
  '#ffb6b9',
  '#ffaaa5',
  '#ffd3b6',
  '#dcedc1',
  '#a8e6cf'
])

const color = ref('rgba(255, 255, 255, 1)')
// 背景颜色设置
const setThisColor = () => {
  setColor(color.value)
}
// 背景颜色设置
function setColor(_color: string) {
  if (!_color) return
  // const workspace: any = editorStore.canvas
  //   ?.getObjects()
  //   .find((item: any) => item.id === 'workspace')
  // workspace.set('fill', c)
  console.log(editorStore.canvas)
  editorStore.canvas?.setBackgroundColor(
    _color,
    editorStore.canvas.renderAll.bind(editorStore.canvas)
  )
  color.value = _color
}

// 加载模板时回显颜色值
const handleChangeColor = () => {
  const workspace: any = editorStore.canvas
    ?.getObjects()
    .find((item: any) => item.id === 'workspace')
  color.value = workspace?.fill ?? ''
}

// 设置背景图
const handleSetBgImg = debounce(function () {
  selectFiles({ accept: 'image/*', multiple: true }).then((fileList: any) => {
    Array.from(fileList).forEach((item: any) => {
      getImgStr(item).then((file: any) => {
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.src = file
        image.onload = function () {
          const ctx = editorStore.canvas
          const { width, height } = image
          const workspaceSize = editorStore.editor.getWorkspaceSize()
          if (!ctx) return
          ctx.setBackgroundImage(file, ctx?.renderAll.bind(ctx), {
            scaleX: workspaceSize.width / width, //计算出图片要拉伸的宽度
            scaleY: workspaceSize.height / height //计算出图片要拉伸的高度
          })
        }
      })
    })
  })
}, 250)

const handleRmoveBgImg = debounce(function () {
  ElMessageBox.confirm('您确定移除画布吗?', 'Warning', {
    title: '提示',
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    editorStore.canvas?.setBackgroundImage(
      // @ts-ignore
      null,
      editorStore.canvas.renderAll.bind(editorStore.canvas)
    )
  })
}, 250)

onMounted(() => {
  nextTick(() => {
    editorStore.editor?.on('loadJson', handleChangeColor)
  })
})

onUnmounted(() => {
  editorStore.editor.off('loadJson', handleChangeColor)
})
</script>

<style scoped lang="scss">
:deep(.el-color-picker) {
  width: 100%;
}
:deep(.el-color-picker__trigger) {
  width: 100%;
  margin-bottom: 3px;
}
:deep(.el-color-picker__color-inner) {
  justify-content: flex-end;
}
.color-list {
  display: flex;
  flex-wrap: wrap;
  span {
    position: relative;
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 3px solid #fff;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
