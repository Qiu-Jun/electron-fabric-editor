<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-12 09:52:22
 * @LastEditTime: 2024-11-28 14:07:18
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\views\home\components\Panel.vue
-->
<template>
  <div class="w-full relative">
    <!-- tab -->
    <div
      class="w-full h-48px box-border px-16px border-b-1px border-b-solid border-b-[rgba(0_0_0/0.08)] mb-12px"
    >
      <div
        v-show="!showSearch"
        class="w-full h-full flex justify-between items-center"
      >
        <ul class="h-full flex justify-start items-center text-14px">
          <li
            class="h-full f-center cursor-pointer select-none mr-10px"
            :class="[
              curTab === 'canvas' ? 'text-#333 font-500 tab-active' : ''
            ]"
            @click="onChangePanel('canvas')"
          >
            {{ $t('editor.panel.title') }}
          </li>
          <li
            class="h-full f-center cursor-pointer select-none"
            :class="[curTab === 'layer' ? 'text-#333 font-500 tab-active' : '']"
            @click="onChangePanel('layer')"
          >
            {{ $t('editor.layer.title') }}
          </li>
        </ul>
        <div class="flex">
          <el-button
            v-if="curTab === 'canvas'"
            text
            @click="hadleCreateTemplate"
            style="padding: 0; width: 32px; border-radius: 6px"
          >
            <el-icon style="font-size: 20px">
              <Plus />
            </el-icon>
          </el-button>
          <el-button
            text
            @click="handleShowSearch"
            style="padding: 0; width: 32px; border-radius: 6px; margin: 0"
          >
            <el-icon style="font-size: 20px">
              <Search />
            </el-icon>
          </el-button>
        </div>
      </div>
      <div
        v-show="showSearch"
        class="w-full h-full flex justify-start items-center"
      >
        <el-icon class="mr-8px"><Search /></el-icon>
        <el-input :placeholder="searchPlaceholder" @blur="showSearch = false" />
      </div>
    </div>
    <!-- 组件 -->
    <div>
      <KeepAlive>
        <component :is="comMap[curTab]"></component>
      </KeepAlive>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/store/modules/editor'
import { Plus, Search } from '@element-plus/icons-vue'
import { panels } from '@/enums/editor'
import { debounce } from 'lodash-es'
import { Layer, Templates } from './components'
import { useTemplate } from '@/hooks/useTemplate'
import { useTemplateStore } from '@/store/modules/template'
import { useI18n } from 'vue-i18n'

type ITab = 'canvas' | 'layer'
const editorStore = useEditorStore()
const templateStore = useTemplateStore()
const { panelType } = storeToRefs(editorStore)
const { t } = useI18n()
const comMap = {
  canvas: Templates,
  layer: Layer
}
// const { createTemplate } = useHandleTemplate()
const showSearch = ref(false)
const curTab = ref<ITab>('canvas')
const searchPlaceholder = computed(() => {
  let placeholderText = ''
  switch (unref(curTab)) {
    case 'canvas':
      placeholderText = `${t('common.placeholder.input') + t('editor.panel.title')}`
      break
    case 'layer':
      placeholderText = `${t('common.placeholder.input') + t('editor.layer.title')}`
      break
    default:
      break
  }

  return placeholderText
})
const onChangePanel = debounce(function (type: ITab) {
  curTab.value = type
}, 250)

const handleShowSearch = debounce(function () {
  showSearch.value = true
}, 250)

const hadleCreateTemplate = debounce(function () {
  const { createTemplate } = useTemplate()
  templateStore.addTemplate(createTemplate())
}, 250)

watch(
  () => panelType.value,
  (val) => {
    // 枚举值未优化
    if (val === panels.canvas) {
      curTab.value = 'canvas'
    } else if (val === panels.layer) {
      curTab.value = 'layer'
    } else {
      return ''
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper) {
  box-shadow: none;
}
</style>
