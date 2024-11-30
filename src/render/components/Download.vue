<!--
 * @Author: June
 * @Description: 
 * @Date: 2024-08-31 20:10:20
 * @LastEditTime: 2024-09-06 11:32:20
 * @LastEditors: June
 * @FilePath: \ai-desing\src\views\editor\components\Download.vue
-->
<template>
  <el-button-group class="ml-10px">
    <el-popover placement="bottom" :width="320" trigger="click">
      <template #reference>
        <el-button type="primary">{{ $t('layout.download') }}</el-button>
      </template>

      <div class="w-full box-border">
        <div class="w-full flex justify-between items-center mb-10px">
          <span class="font-bold text-18px">下载作品</span>
          <el-icon size="16" color="#333"><Close /></el-icon>
        </div>
        <div class="w-full">
          <div class="w-full flex justify-between items-center mb-10px">
            <span class="font-bold text-16px">作品类型</span>
          </div>
          <div class="w-full flex justify-between items-center mb-10px">
            <el-select v-model="imgType" clearable placeholder="Select" style="width: 240px">
              <el-option v-for="item in imgTypeList" :key="item.type" :value="item.type">
                <div>
                  <div>{{ item.name }}</div>
                  <div>{{ item.desc }}</div>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </el-popover>
    <el-popover
      placement="bottom"
      title="Title"
      :width="200"
      trigger="click"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button type="primary" :icon="MoreFilled" />
      </template>
    </el-popover>
  </el-button-group>
</template>

<script lang="ts" setup>
import { MoreFilled, Close } from '@element-plus/icons-vue'

// 图片类型
type ImgTypes = 'JPG' | 'PNG' | 'PDF' | 'PPT'
const imgType = ref<ImgTypes>('JPG')
const imgTypeList = [
  {
    type: 'JPG',
    name: 'JPG',
    desc: '文件较小的图片，不支持透明背景'
  },
  {
    type: 'PNG',
    name: 'PNG',
    desc: '优质无损图片，图片较大，支持透明背景'
  },
  {
    type: 'PDF',
    name: 'PDF印刷',
    desc: '优质单/多页文档'
  },
  {
    type: 'PPT',
    name: 'PPT文件',
    desc: '支持文字编辑，轻松应对汇报演讲'
  }
]
</script>
