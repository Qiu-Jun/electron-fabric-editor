<!--
 * @Author: June
 * @Description: 右侧属性面板:未选中展示背景设置,单选/多选时按元素类型按需挂载属性面板
 * @Date: 2024-09-12 19:09:40
 * @LastEditTime: 2026-09-14 10:40:00
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\views\home\components\EditorContent\PanelRight\index.vue
-->
<template>
  <!-- 属性区域 380-->
  <section class="right-bar flex-basis-304px box-border overflow-hidden p-10px">
    <!-- 未选择元素时 展示背景设置 -->
    <div v-if="!mixinState.mSelectMode">
      <SetSize />
      <BgBar />
    </div>

    <!-- 多选时展示 -->
    <div v-if="mixinState.mSelectMode === 'multiple'">
      <!-- 分组 -->
      <Group />
      <!-- 组对齐方式 -->
      <Align />
      <!-- 居中对齐 -->
      <CenterAlign />
    </div>

    <!-- 单选时按元素类型挂载,无关面板不再执行脚本与监听 -->
    <div v-if="mixinState.mSelectMode === 'one'" class="attr-item-box">
      <Group />

      <!-- 快捷操作 -->
      <QuickOperation />

      <!-- 居中对齐 -->
      <CenterAlign />
      <!-- 替换图片 -->
      <ReplaceImg v-if="isImage" />
      <!-- 图片裁剪(内部含裁剪库,异步加载) -->
      <CropImage v-if="isImage" />
      <!-- 图片裁切 -->
      <ClipImage v-if="isImage" />
      <!-- 翻转 -->
      <Flip />
      <!-- 条形码属性 -->
      <AttributeBarcode v-if="isImage" />
      <!-- 二维码 -->
      <AttributeQrCode v-if="isImage" />
      <!-- 图片滤镜 -->
      <Filters v-if="isImage" />
      <!-- 图片描边 -->
      <ImgStroke v-if="isImage" />
      <!-- 颜色 -->
      <AttributeColor v-if="!isImage && !isGroup" />
      <!-- 字体属性 -->
      <AttributeFont v-if="isText" />
      <!-- 字体小数点 -->
      <AttributeTextFloat v-if="isText" />
      <!-- 文字内容  -->
      <AttributeTextContent v-if="isText" />
      <!-- 位置信息 -->
      <AttributePostion />
      <!-- 阴影 -->
      <AttributeShadow />
      <!-- 边框 -->
      <AttributeBorder v-if="!isGroup" />
      <!-- 圆角 -->
      <AttributeRounded v-if="isRect" />
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
const { mixinState, selectType } = useSelect()
const editor = computed(() => editorStore.editor)

// 文本/图片/矩形/组合,用于按需挂载对应属性面板
const isText = computed(() =>
  ['i-text', 'textbox', 'text'].includes(selectType.value)
)
const isImage = computed(() => selectType.value === 'image')
const isRect = computed(() => selectType.value === 'rect')
const isGroup = computed(() => selectType.value === 'group')

// 局部异步组件优先于全局注册,使裁剪库进入懒加载分包
const CropImage = defineAsyncComponent(
  () => import('@/components/CropImage/index.vue')
)
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
