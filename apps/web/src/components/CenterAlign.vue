<!--
 * @Author: June
 * @Description: Description
 * @Date: 2024-08-19 12:53:30
 * @LastEditTime: 2024-11-29 10:12:24
 * @LastEditors: June
-->
<template>
  <div class="attr-item-box" v-if="isSelect">
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.group.centerAlign.name') }}</h4>
    </el-divider>
    <div class="bg-item">
      <!-- 水平集中 -->
      <el-tooltip :content="$t('editor.attrSetting.group.centerAlign.centerX')">
        <el-button @click="position('centerH')" link>
          <SvgIcon extClass="text-20px" color="#fff" icon="center-x" />
        </el-button>
      </el-tooltip>
      <!-- 水平垂直居中 -->
      <el-tooltip :content="$t('editor.attrSetting.group.centerAlign.center')">
        <el-button @click="position('center')" link>
          <SvgIcon extClass="text-20px" color="#fff" icon="center-v" />
        </el-button>
      </el-tooltip>
      <!-- 垂直居中 -->
      <el-tooltip :content="$t('editor.attrSetting.group.centerAlign.centerY')">
        <el-button @click="position('centerV')" link>
          <SvgIcon extClass="text-20px" color="#fff" icon="center-y" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const { isSelect } = useSelect()
const editorStore = useEditorStore()
const position = (name: string) => {
  editorStore.editor.position(name)
}
</script>
<style scoped lang="scss">
:deep(.el-button) {
  &[disabled] {
    svg {
      opacity: 0.2;
    }
  }
}
</style>
