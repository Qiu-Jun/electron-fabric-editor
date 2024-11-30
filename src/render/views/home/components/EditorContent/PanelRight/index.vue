<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-12 19:09:40
 * @LastEditTime: 2024-11-28 16:09:01
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\views\home\components\EditorContent\PanelRight\index.vue
-->
<template>
  <!-- 属性区域 380-->
  <section class="right-bar flex-basis-304px box-border overflow-hidden p-10px">
    <!-- 未选择元素时 展示背景设置 -->
    <div v-show="!mixinState.mSelectMode">
      <SetSize />
      <BgBar />
    </div>

    <!-- 多选时展示 -->
    <div v-show="mixinState.mSelectMode === 'multiple'">
      <!-- 分组 -->
      <Group />
      <!-- 组对齐方式 -->
      <Align />
      <!-- 居中对齐 -->
      <CenterAlign />
    </div>

    <div v-show="mixinState.mSelectMode === 'one'" class="attr-item-box">
      <Group />

      <!-- 快捷操作 -->
      <QuickOperation />

      <!-- 居中对齐 -->
      <CenterAlign />
      <!-- 替换图片 -->
      <ReplaceImg />
      <!-- 图片裁剪 -->
      <CropImage />
      <!-- 图片裁切 -->
      <ClipImage />
      <!-- 翻转 -->
      <Flip />
      <!-- 条形码属性 -->
      <AttributeBarcode />
      <!-- 二维码 -->
      <AttributeQrCode />
      <!-- 图片滤镜 -->
      <Filters />
      <!-- 图片描边 -->
      <ImgStroke />
      <!-- 颜色 -->
      <AttributeColor />
      <!-- 字体属性 -->
      <AttributeFont />
      <!-- 字体小数点 -->
      <AttributeTextFloat />
      <!-- 文字内容  -->
      <AttributeTextContent />
      <!-- 位置信息 -->
      <AttributePostion />
      <!-- 阴影 -->
      <AttributeShadow />
      <!-- 边框 -->
      <AttributeBorder />
      <!-- 圆角 -->
      <AttributeRounded />
      <!-- 关联数据 -->
      <AttributeId />

      <!-- 新增字体样式使用 -->
      <el-button @click="editor.getFontJson()" size="small">
        {{ $t('editor.attrSetting.data.getFontStyle') }}
      </el-button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { mixinState } = useSelect()
const editor = computed(() => editorStore.editor)
</script>

<style lang="scss" scoped>
.right-bar {
  box-sizing: border-box;
  width: 304px;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  background: #fff;
}
</style>
