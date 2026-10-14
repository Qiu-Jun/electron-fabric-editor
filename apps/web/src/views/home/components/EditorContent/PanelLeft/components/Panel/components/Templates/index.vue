<!--
 * @Author: June
 * @Description: 页面列表,缩略图由PreviewPlugin实时生成
 * @Date: 2024-10-03 12:34:51
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 16:50:00
 * @FilePath: \element-fabric-editor\src\views\home\components\EditorContent\PanelLeft\components\Panel\components\Templates\index.vue
-->
<template>
  <div
    class="w-full h-full box-border px-10px flex flex-col gap-10px overflow-y-auto"
  >
    <div
      class="relative w-full box-border rounded-8px cursor-pointer border-4px border-solid flex justify-center"
      :class="[
        curTempIdx === idx
          ? 'border-[var(--el-color-primary)]'
          : 'border-transparent'
      ]"
      v-for="(item, idx) in templateList"
      :key="item.id"
      @click="handleChangeTemplate(idx)"
    >
      <div
        class="relative w-full box-border border-1px border-solid border-[var(--bg-gray)] rounded-8px"
        :style="{
          width: props.direction === 'vertical' ? '184px' : '64px'
        }"
      >
        <img v-if="item.image" class="w-full inline-block" :src="item.image" />
        <div
          v-else
          class="w-full inline-block bg-[#fff]"
          :style="{ aspectRatio: `${item.width || 1} / ${item.height || 1}` }"
        ></div>

        <div
          class="inline-block flex items-center justify-center text-center absolute text-#fff bg-[rgba(0_0_0/0.6)]"
          :class="
            props.direction === 'horizontal'
              ? 'left-4px bottom-8px text-10px w-14px h-14px rounded-2px leading-12px'
              : 'left-8px bottom-12px text-12px w-20px h-20px rounded-4px leading-18px'
          "
        >
          {{ idx + 1 }}
        </div>

        <!-- 删除页面:仅选中项显示 -->
        <div
          v-if="curTempIdx === idx"
          class="absolute right-4px top-4px f-center w-20px h-20px rounded-4px bg-[rgba(0_0_0/0.6)] cursor-pointer z-1"
          title="删除页面"
          @click="handleDeleteTemplate(idx, $event)"
        >
          <el-icon :size="12" color="#fff"><Delete /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash-es'
import { Delete } from '@element-plus/icons-vue'
import { useTemplateStore } from '@/store/modules/template'

const props = defineProps({
  direction: {
    type: String,
    default: 'vertical' // vertical  horizontal
  }
})
const templateStore = useTemplateStore()
const { curTempIdx, templateList } = storeToRefs(templateStore)

const handleChangeTemplate = debounce(function (idx: number) {
  templateStore.switchTemplate(idx)
}, 250)

// 删除选中页面;阻止冒泡避免误触发页面切换
function handleDeleteTemplate(idx: number, e: MouseEvent) {
  e.stopPropagation()
  templateStore.deleteTemplate(idx)
}
</script>
