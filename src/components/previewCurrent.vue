<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-04-09 11:19:07
 * @LastEditors: June
 * @LastEditTime: 2023-10-28 13:42:44
 * @FilePath: \vue-fabric-editor\src\components\preview.vue
 * @Description: 预览组件
-->
<template>
  <Button type="text" @click="preview">
    {{ $t('preview') }}
  </Button>
</template>

<script name="PreviewCurrent" lang="ts" setup>
import { ImagePreview } from 'view-ui-plus'

const canvasEditor = inject('canvasEditor') as any
const preview = () => {
  canvasEditor.preview().then((dataUrl: string) => {
    // const dataUrl = getImgUrl();
    ImagePreview.show({
      previewList: [dataUrl]
    })
  })
}
</script>

<style scoped lang="less"></style>
