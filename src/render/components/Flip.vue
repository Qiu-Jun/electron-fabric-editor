<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-09-05 23:16:20
 * @LastEditTime: 2024-11-28 15:13:49
 * @LastEditors: June
 * @FilePath: \ai-desing\src\views\editor\components\Flip.vue
-->
<template>
  <div v-if="isOne" class="attr-item-box mt-8px">
    <div class="bg-item">
      <el-tooltip :content="$t('editor.flip.x')">
        <el-button @click="flip('X')" link>
          <SvgIcon extClass="text-20px" color="#fff" icon="flip-x" />
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('editor.flip.y')">
        <el-button @click="flip('Y')" link>
          <SvgIcon extClass="text-20px" color="#fff" icon="flip-y" />
        </el-button>
      </el-tooltip>
    </div>

    <!-- <Divider plain></Divider> -->
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne } = useSelect()

const flip = (type: string) => {
  const activeObject: any = editorStore.canvas?.getActiveObject()
  activeObject.set(`flip${type}`, !activeObject[`flip${type}`]).setCoords()
  editorStore.canvas?.requestRenderAll()
}
</script>

<style scoped lang="scss">
:deep(.el-button) {
  flex: 1;
  &[disabled] {
    svg {
      opacity: 0.2;
    }
  }
}
</style>
