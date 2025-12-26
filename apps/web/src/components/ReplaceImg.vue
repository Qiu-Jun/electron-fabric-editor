<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-06 00:10:51
 * @LastEditTime: 2024-11-28 16:14:15
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\components\ReplaceImg.vue
-->
<template>
  <div v-if="isOne && type === 'image'" class="attr-item-box mt-8px">
    <div class="bg-item">
      <el-button @click="repleace" text>
        {{ $t('editor.imageSetting.repleaceImg') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Utils } from '@/lib/core'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne } = useSelect()
const { getImgStr, selectFiles, insertImgFile } = Utils

const update = getCurrentInstance()
const type = ref('')

// 替换图片
const repleace = async () => {
  const activeObject: any = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject && activeObject.type === 'image') {
    // 图片
    // @ts-ignore
    const [file] = await selectFiles({ accept: 'image/*', multiple: false })
    // 转字符串
    const fileStr = await getImgStr(file)
    // 字符串转El
    // @ts-ignore
    const imgEl: any = await insertImgFile(fileStr)
    const width = activeObject.get('width')
    const height = activeObject.get('height')
    const scaleX = activeObject.get('scaleX')
    const scaleY = activeObject.get('scaleY')
    activeObject.setSrc(imgEl.src, () => {
      activeObject.set('scaleX', (width * scaleX) / imgEl.width)
      activeObject.set('scaleY', (height * scaleY) / imgEl.height)
      editorStore.canvas?.renderAll()
    })
    imgEl.remove()
  }
}

const init = () => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    // @ts-ignore
    type.value = activeObject.type
    update?.proxy?.$forceUpdate()
  }
}

onMounted(() => {
  nextTick(() => {
    editorStore.editor?.on('selectOne', init)
  })
})

onBeforeUnmount(() => {
  editorStore.editor?.off('selectOne', init)
})
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  width: 100%;
}
</style>
