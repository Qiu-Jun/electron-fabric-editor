<!--
 * @Author: June
 * @Description: 替换图片面板
 * @Date: 2024-09-06 00:10:51
 * @LastEditTime: 2026-09-14 10:25:00
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\components\ReplaceImg.vue
-->
<template>
  <div v-if="isOne && selectType === 'image'" class="attr-item-box mt-8px">
    <div class="bg-item">
      <el-button @click="replaceImg" text>
        {{ $t('editor.imageSetting.replaceImg') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Utils } from '@/lib/core'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
// 共享选中状态直接判断图片类型,无需本地监听
const { isOne, selectType } = useSelect()
const { getImgStr, selectFiles, insertImgFile } = Utils

// 替换图片
const replaceImg = async () => {
  const activeObject: any = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject && activeObject.type === 'image') {
    // 图片
    const [file] = await selectFiles({ accept: 'image/*', multiple: false })
    // 转字符串
    const fileStr = await getImgStr(file)
    // 字符串转El
    const imgEl: any = await insertImgFile(fileStr)
    const width = activeObject.get('width')
    const height = activeObject.get('height')
    const scaleX = activeObject.get('scaleX')
    const scaleY = activeObject.get('scaleY')
    activeObject.setSrc(imgEl.src, () => {
      activeObject.set('scaleX', (width * scaleX) / imgEl.width)
      activeObject.set('scaleY', (height * scaleY) / imgEl.height)
      activeObject.set('originSrc', imgEl.src)
      editorStore.canvas?.renderAll()
    })
    imgEl.remove()
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  width: 100%;
}
</style>
