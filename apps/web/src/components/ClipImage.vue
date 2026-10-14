<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2024-11-28 16:19:59
 * @LastEditors: June
-->
<template>
  <div v-if="isOne && selectType === 'image'" class="attr-item-box mt-8px">
    <div class="bg-item" style="margin-bottom: 10px">
      <el-dropdown style="width: 270px" @command="addClipPath">
        <el-button text>{{ $t('editor.imageSetting.crop.create') }}</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in options"
              :key="item.value"
              :command="item.value"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="bg-item">
      <el-button @click="removeClip" text>
        {{ $t('editor.imageSetting.crop.remove') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'
import { useI18n } from 'vue-i18n'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
// 共享选中状态直接判断图片类型,无需本地监听
const { isOne, selectType } = useSelect()
const { t } = useI18n()
const options = [
  {
    label: t('editor.polygonClip'),
    value: 'polygon'
  },
  {
    label: t('editor.rectClip'),
    value: 'rect'
  },
  {
    label: t('editor.circleClip'),
    value: 'circle'
  },
  {
    label: t('editor.triangleClip'),
    value: 'triangle'
  },
  {
    label: t('editor.polygonClipInverted'),
    value: 'polygon-inverted'
  },
  {
    label: t('editor.rectClipInverted'),
    value: 'rect-inverted'
  },
  {
    label: t('editor.circleClipInverted'),
    value: 'circle-inverted'
  },
  {
    label: t('editor.triangleClipInverted'),
    value: 'triangle-inverted'
  }
]
const addClipPath = async (name: string) => {
  editorStore.editor.addClipPathToImage(name)
}
const removeClip = () => {
  editorStore.editor.removeClip()
}
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  width: 100%;
}
</style>
