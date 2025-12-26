<template>
  <el-button-group>
    <el-button @click="big">
      <SvgIcon extClass="text-20px" color="var(--color)" icon="zoom-big" />
    </el-button>
    <el-button @click="rSet" :icon="FullScreen"></el-button>
    <el-button @click="setViewport">
      <SvgIcon extClass="text-20px" color="var(--color)" icon="zoom-small" />
    </el-button>
  </el-button-group>
</template>

<script lang="ts" setup>
import { FullScreen } from '@element-plus/icons-vue'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()

const rSet = () => {
  editorStore.editor.one()
}
const big = () => {
  editorStore.editor.big()
}
const small = () => {
  editorStore.editor.small()
}
const setViewport = () => {
  editorStore.editor.auto()
}
</script>
