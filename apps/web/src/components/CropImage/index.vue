<!--
 * @Author: June
 * @Description: 图片裁剪面板
 * @Date: 2024-11-17 10:30:49
 * @LastEditTime: 2026-09-14 10:20:00
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\components\CropImage\index.vue
-->
<template>
  <div v-if="isOne && selectType === 'image'" class="attr-item-box mt-8px">
    <div class="bg-item">
      <el-button class="w-full" @click="cropper" text>
        {{ $t('editor.imageSetting.crop.title') }}
      </el-button>
    </div>
  </div>
  <CropModal ref="cropperDialogRef"></CropModal>
</template>

<script setup name="CropperImg">
import useSelect from '@/hooks/select'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
import CropModal from './CropModal.vue'
import { Utils } from '@/lib/core'
const { insertImgFile } = Utils

const { isOne, selectType } = useSelect()
const cropperDialogRef = ref()
const cropper = () => {
  const activeObject = editorStore.canvas.getActiveObjects()[0]
  if (activeObject && activeObject.type === 'image') {
    cropperDialogRef.value.open(
      { img: activeObject._element.src },
      async (data) => {
        const imgEl = await insertImgFile(data)
        activeObject.setSrc(imgEl.src, () => {
          editorStore.canvas.renderAll()
        })
        imgEl.remove()
      }
    )
  }
}
</script>
