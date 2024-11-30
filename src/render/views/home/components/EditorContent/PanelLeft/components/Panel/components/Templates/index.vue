<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-10-03 12:34:51
 * @LastEditTime: 2024-11-22 15:09:17
 * @LastEditors: June
-->
<template>
  <div class="w-full h-full box-border px-10px">
    <div
      class="relative w-full box-border rounded-8px cursor-pointer"
      :class="[
        curTempIdx === idx
          ? 'border-10px border-solid border-[var(--el-color-primary)]'
          : ''
      ]"
      :style="{
        height: height + 'px'
      }"
      v-for="(item, idx) in templateList"
      :key="idx"
      @click="handleChangeTemplate(idx)"
    >
      <div
        class="relative w-full border-1px border-solid border-[var(--bg-gray)] rounded-8px"
        :style="{
          width: props.direction === 'vertical' ? '184px' : '64px'
        }"
      >
        <img class="w-full inline-block" :src="item.image" />

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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateStore } from '@/store/modules/template'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/store/modules/editor'
import { debounce } from 'lodash-es'
import type { Template } from '@/types/template'

const props = defineProps({
  direction: {
    type: String,
    default: 'vertical' // vertical  horizontal
  }
})
const editorStore = useEditorStore()
const templateStore = useTemplateStore()
const { curTempIdx, templateList, curTemplate } = storeToRefs(templateStore)

console.log(
  curTempIdx,
  templateList,
  curTemplate,
  '000000000000000000000000000000000'
)

const height = computed(() => {
  const _curTemplate = unref(curTemplate)
  const direction = props.direction
  const size = direction === 'vertical' ? 176 : 64
  const radio = (_curTemplate.height || 0) / _curTemplate.width
  return size * radio
})

const handleChangeTemplate = debounce(function (idx: number) {
  templateStore.setTemplateIndex(idx)
}, 250)

onMounted(() => {
  editorStore.canvas?.on('object:modified', updateBlobImg)
})

onBeforeUnmount(() => {
  editorStore.canvas?.off('object:modified', updateBlobImg)
})

function updateBlobImg() {
  const curTemp = unref(templateList)[unref(curTempIdx)]
  if (curTemp && curTemp.image && curTemp.image.startsWith('blob:')) {
    URL.revokeObjectURL(curTemp.image)
    editorStore.canvas?.toCanvasElement(10).toBlob((blob) => {
      if (blob) {
        curTemp.image = URL.createObjectURL(blob)
      }
    })
  }
}
</script>
