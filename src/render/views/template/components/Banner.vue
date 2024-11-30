<!--
 * @Author: 秦少卫
 * @Date: 2024-06-12 16:48:10
 * @LastEditors: June
 * @LastEditTime: 2024-11-22 08:01:28
 * @Description: 幻灯片
-->
<template>
  <div class="banner">
    <el-carousel
      v-model="value"
      :height="250"
      :autoplay="setting.autoplay"
      :autoplay-speed="setting.autoplaySpeed"
      :dots="setting.dots"
      :radius-dot="setting.radiusDot"
      :trigger="setting.trigger"
      :arrow="setting.arrow"
    >
      <el-carousel-item class="img-box" v-for="item in banners" :key="item.id">
        <a :href="item.url" target="_blank">
          <img :src="item.img" :alt="item.title" />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script name="Banner" setup>
import { getBannerList } from '@/api/material'
import qs from 'qs'
import { getMaterialInfoUrl } from '@/hooks/usePageList'

const setting = reactive({
  autoplay: false,
  autoplaySpeed: 2000,
  dots: 'inside',
  radiusDot: false,
  trigger: 'click',
  arrow: 'hover'
})

const banners = ref([])
getBannerList(
  qs.stringify({
    populate: {
      img: '*'
    }
  })
).then((res) => {
  banners.value = res.data.data.map((item) => {
    return {
      id: item.id,
      title: item.attributes.title,
      img: getMaterialInfoUrl(item.attributes.img),
      url: item.attributes.url
    }
  })
})
</script>
<style lang="scss" scoped>
.banner {
  @apply w-1200px mx-auto mt-20px rounded-10px overflow-hidden;
}
.img-box {
  @apply overflow-hidden h-full;
  img {
    @apply h-full mx-auto block;
  }
}
</style>
