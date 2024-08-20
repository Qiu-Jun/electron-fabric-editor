<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 09:12:24
 * @LastEditors: June
 * @LastEditTime: 2024-07-24 20:30:09
 * @Description: logo
-->

<template>
  <div class="logo inline-block mr-10px">
    <a class="flex h-full align-center" :href="webInfo.url" target="_blank">
      <img class="inline-block" :src="webInfo.img" alt="webInfo.name" />
    </a>
  </div>
</template>

<script setup name="Logo">
import { apiHost } from '@/constants/app'
import { getWebInfo } from '@/api/material'
import { get, pick } from 'lodash-es'
const baseURL = apiHost

const webInfo = ref({
  name: '',
  logo: '',
  url: ''
})

const getWebInfoFun = async () => {
  const res = await getWebInfo()
  const info = pick(res.data.data.attributes, ['name', 'url'])
  info.img = baseURL + get(res.data, 'data.attributes.logo.data.attributes.url')
  webInfo.value = info
}

getWebInfoFun()
</script>

<style scoped lang="scss">
.logo {
  width: 117px;
  height: 44px;
  a {
    img {
      height: 80%;
    }
  }
}
</style>
