<!--
 * @Author: June
 * @Description: 关联数据属性面板
 * @Date: 2024-09-05 23:00:59
 * @LastEditTime: 2026-09-14 10:10:00
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\components\AttributeId.vue
-->
<template>
  <div class="mb-10px attr-item-box" v-if="isOne">
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.data.title') }}</h4>
    </el-divider>

    <el-form :label-width="40" class="form-wrap">
      <el-form-item :label="$t('editor.attrSetting.data.id')">
        <el-input
          v-model="baseAttr.id"
          @change="changeCommon('id', baseAttr.id)"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-select
          v-model="baseAttr.linkData[0]"
          filterable
          allow-create
          :placeholder="$t('common.placeholder.select')"
          @change="changeCommon('linkData', baseAttr.linkData)"
        >
          <el-option value="src"></el-option>
          <el-option value="text"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-input
          v-model="baseAttr.linkData[1]"
          :placeholder="$t('common.placeholder.input')"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import useAttrPanel from '@/hooks/useAttrPanel'

const { isOne, changeCommon } = useAttrPanel({
  // 回显关联数据
  getAttrs: (activeObject) => {
    baseAttr.id = activeObject.get('id')
    baseAttr.linkData = activeObject.get('linkData') || ['', '']
  }
})

// 属性值
const baseAttr = reactive({
  id: '',
  linkData: ['', '']
})
</script>
