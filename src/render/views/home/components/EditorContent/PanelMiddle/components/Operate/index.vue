<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-10-03 11:48:10
 * @LastEditTime: 2024-11-24 09:55:33
 * @LastEditors: June
-->
<template>
  <div class="w-full absolute left-0 right-0 bottom-0">
    <div class="main-bottom relative bottom-0">
      <div class="flex justify-between items-start">
        <div class="flex justify-start items-center">
          <div
            class="f-center p-5px rounded-6px cursor-pointer bg-#fff"
            @click.stop="changePanelType(panels.layer)"
          >
            <SvgIcon icon="editor-layer" extClass="text-20px" />
          </div>
          <div
            class="ml-4px f-center p-4px rounded-6px cursor-pointer bg-#fff panel-canvas"
            @click="changePanelType(panels.canvas)"
          >
            <div class="text-14px h-24px leading-24px">
              <span class="mr-4px">{{ $t('editor.panel.title') }}</span>
              <span>1/1</span>
            </div>

            <div
              class="ml-4px"
              :class="[panelPositoin === 'bottom' ? 'rotate-270' : '']"
              @click.stop="bottomToggle"
            >
              <SvgIcon icon="unfold" extClass="text-16px" />
            </div>

            <div
              class="hidden panel-position items-center"
              @click.stop="changePanelPos"
            >
              <el-divider direction="vertical" />
              <SvgIcon
                :class="[panelPositoin === 'bottom' ? 'rotate-270' : '']"
                icon="panel-position"
                extClass="text-16px"
              />
            </div>
          </div>
        </div>

        <!-- 比例 -->

        <div class="flex justify-end items-center">
          <Drag />
          <Zoom />
          <!-- <div
            class="f-center p-4px rounded-6px cursor-pointer bg-#fff flex justify-center items-center h-32px panel-zoom"
          >
            <div class="hidden zoom-position">
              <el-button
                text
                style="height: 24px; width: 24px; padding: 0"
                :icon="Minus"
                @click="scaleCanvas('-')"
              />

              <el-button
                text
                style="height: 24px; width: 24px; padding: 0; margin-left: 4px"
                :icon="Plus"
                @click="scaleCanvas('+')"
              />
            </div>
            <Zoom />
          </div>
          <div
            class="w-32px h-32px bg-#fff ml-5px rounded-6px cursor-pointer flex items-center justify-center"
          >
            <SvgIcon icon="question-mark" extClass="text-20px" />
          </div> -->
        </div>
      </div>

      <!-- 底部画板 -->
      <div
        v-if="panelPositoin === 'bottom' && showPanel"
        class="main-panel mt-8px bg-#fff box-border rounded-12px"
      >
        <div class="pb-1px mx-6px">
          1
          <!-- <Thumb direction="horizontal" class="py-6px" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash-es'
import { panels } from '@/enums/editor'
import { Plus, Minus } from '@element-plus/icons-vue'
import { useEditorStore } from '@/store/modules/editor'
import { Drag, Zoom } from './components'

const editorStore = useEditorStore()
const { panelPositoin, showPanel, panelType } = storeToRefs(editorStore)
const changePanelType = debounce(function (type: panels) {
  if (unref(panelType) === type) {
    // 如果相等  那么做显示/隐藏
    editorStore.setShowPanel(!unref(showPanel))
    unref(panelPositoin) === 'bottom' && editorStore.setPanelPositoin('left')
  } else {
    // 如果不是同一个值  那么设置类型并且显示
    editorStore.setPanelType(type)
    editorStore.setShowPanel(true)
  }
}, 250)

const bottomToggle = debounce(function () {
  editorStore.setShowPanel(!unref(showPanel))
}, 250)

const changePanelPos = debounce(function () {
  editorStore.setPanelPositoin(
    unref(panelPositoin) === 'left' ? 'bottom' : 'left'
  )
  !unref(showPanel) && editorStore.setShowPanel(true)
}, 250)
</script>

<style lang="scss" scoped>
.main-bottom {
  padding: 4px 12px 12px;
  transition: all 0.25s cubic-bezier(0.45, 0, 0.4, 1);

  .main-panel {
    transition: all 0.25s ease;
    box-shadow:
      0px 0px 2px 0px rgba(0, 0, 0, 0.08),
      0px 4px 12px 0px rgba(0, 0, 0, 0.04);
  }

  .panel-canvas {
    &:hover .panel-position {
      display: flex;
    }
  }
  .panel-zoom {
    &:hover .zoom-position {
      display: flex;
    }
  }
}
</style>
