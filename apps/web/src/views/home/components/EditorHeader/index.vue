<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-12 18:51:45
 * @LastEditTime: 2024-11-23 13:51:32
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\views\home\components\EditorHeader\index.vue
-->
<template>
  <div class="w-full flex justify-between items-center">
    <div class="flex justify-start items-center">
      <Logo />

      <el-divider direction="vertical" />
      <router-link custom v-slot="{ navigate }" to="/editor/template">
        <el-button text @click="navigate">{{
          $t('editor.header.allTemplate')
        }}</el-button>
      </router-link>
      <el-divider direction="vertical" />
      <MyTemplName />

      <el-switch
        v-model="rulerEnable"
        size="large"
        class="ml-10px"
        inline-prompt
        :active-text="$t('editor.header.ruler')"
        :inactive-text="$t('editor.header.ruler')"
        @change="onRulerEnable"
      />

      <el-divider direction="vertical" />
      <History />
    </div>
    <div class="flex justify-end items-center">
      <a
        class="mr-10px"
        href="https://github.com/ikuaitu/element-fabric-editor"
        target="_blank"
      >
        <img
          src="https://img.shields.io/badge/GitHub-ElementFbricEditor-blue"
          alt="element-fabric-editor"
        />
      </a>
      <Lang />
      <el-divider direction="vertical" />
      <Preview />
      <el-divider direction="vertical" />
      <Clear />
      <el-divider direction="vertical" />
      <Save />
      <el-divider direction="vertical" />
      <Login />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Clear, History, Preview, Save, MyTemplName } from './components'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
// 标尺
const rulerEnable = computed(() => editorStore.rulerEnable)
const onRulerEnable = (val: string | number | boolean) => {
  if (val) {
    editorStore.editor.rulerEnable()
  } else {
    editorStore.editor.rulerDisable()
  }
  editorStore.updateRulerEnable(val as boolean)
  // 使标尺开关组件失焦，避免响应键盘的空格事件
  // @ts-ignore
  document.activeElement.blur()
}
</script>
