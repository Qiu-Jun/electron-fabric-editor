<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-09-12 19:09:28
 * @LastEditTime: 2024-11-23 16:52:32
 * @LastEditors: June
-->
<template>
  <section class="flex justify-start max-w-384px basis-72px">
    <!-- 左侧一级菜单 -->
    <ul
      class="relative bg-#fff z-1 w-72px flex flex-col items-center pt-10px box-border border-r-#eef2f8 border-r-solid border-r-1px"
    >
      <li
        class="flex flex-col items-center mb-20px cursor-pointer"
        v-for="tab in tabList"
        :key="tab.type"
        @click="tabChange(tab.type, panels.menu)"
      >
        <div
          class="px-10px f-center py-4px rounded-10px tab-item editor-item"
          :class="[currentTab === tab.type ? 'tab-item_active' : '']"
        >
          <SvgIcon
            extClass="text-20px"
            :icon="tab.icon"
            :color="currentTab === tab.type ? '#000' : '#333'"
          />
        </div>
        <span
          class="text-12px"
          :class="[currentTab === tab.type ? 'font-bold' : '']"
          >{{ $t(tab.name) }}</span
        >
      </li>
    </ul>

    <!-- 二级  二级有两个宽度不一样的 -->
    <div
      v-if="panelPositoin === 'left'"
      class="relative h-full transition-all transition-ease left-style-panel"
      :class="[
        !showPanel ? '-ml-312px' : '',
        panelType === panels.menu ? 'w-312px' : 'w-224px'
      ]"
    >
      <template v-if="showPanel && panelType === panels.menu">
        <KeepAlive>
          <component :is="tabComMap[currentTab]" />
        </KeepAlive>
        <div
          class="inline-block absolute -right-13px top-50% -translate-y-50% z-1 cursor-pointer"
          @click="handleHideSubMenu"
        >
          <img src="@/assets/icon/close-btn.svg" />
        </div>
      </template>
      <template v-else>
        <Panel />
      </template>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { tabList } from '@/constants/editor'
import { editorTabs, panels } from '@/enums/editor'
import { Create, Template, Material, Ai, Text, Mine, Panel } from './components'
import { useEditorStore } from '@/store/modules/editor'
import { storeToRefs } from 'pinia'

const editorStore = useEditorStore()
const { panelType, showPanel, tabType, panelPositoin } =
  storeToRefs(editorStore)
const tabComMap: Record<editorTabs, any> = {
  [editorTabs.create]: Create,
  [editorTabs.template]: Template,
  [editorTabs.ai]: Ai,
  [editorTabs.text]: Text,
  [editorTabs.material]: Material,
  [editorTabs.mine]: Mine,
  [editorTabs.none]: ''
}

// 二级菜单
const handleHideSubMenu = debounce(function () {
  editorStore.setShowPanel(false)
  currentTab.value = editorTabs.none
}, 250)
// 左侧tab相关
const currentTab = ref<editorTabs>(editorTabs.template)
const tabChange = debounce(function (type: editorTabs, _subType: panels) {
  currentTab.value = type
  !unref(showPanel) && editorStore.setShowPanel(true)
  unref(panelPositoin) === 'bottom' && editorStore.setPanelPositoin('left')
  unref(panelType) !== panels.menu && (panelType.value = _subType)
  editorStore.setTabType(type)
}, 250)

watch(
  () => tabType.value,
  (val) => {
    if (unref(currentTab) === val) return
    currentTab.value = val
  }
)
</script>

<style lang="scss" scoped>
.tab-item {
  &_active {
    background-color: #e8eaec !important;
  }
}
.editor-item:hover {
  background: rgba(0, 0, 0, 0.12);
}
</style>
