<!--
 * @Author: 秦少卫
 * @Date: 2024-04-25 15:30:54
 * @LastEditors: June
 * @LastEditTime: 2024-11-24 09:35:57
 * @Description: 我的素材
-->

<template>
  <div class="box-border p-10px my-material" v-if="isLogin">
    <el-tabs v-model="type">
      <el-tab-pane :label="$t('editor.template')" name="templ">
        <myTempl v-if="type === 'templ'"></myTempl>
      </el-tab-pane>
      <el-tab-pane :label="$t('editor.image')" name="img">
        <uploadMaterial v-if="type === 'img'"></uploadMaterial>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="tip" v-else>{{ $t('common.login.tips.loginFirst') }}</div>
</template>

<script setup name="ImportTmpl">
import { getFileList } from '@/api/user'
import uploadMaterial from './uploadMaterial.vue'
import myTempl from './myTempl.vue'

const type = ref('templ')
const isLogin = ref(false)
const getFileListHandle = () => {
  // 获取素材列表
  getFileList()
    .then(() => {
      isLogin.value = true
    })
    .catch(() => {
      isLogin.value = false
    })
}

getFileListHandle()
</script>

<style scoped lang="scss">
.tip {
  padding: 20px;
  text-align: center;
}
</style>
