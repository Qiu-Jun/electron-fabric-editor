<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 16:34:23
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-12 15:41:52
 * @Description: 分页组件
-->

<template>
  <!-- 列表 -->
  <div
    class="page-list-box"
    style="height: calc(100vh - 100px)"
    :id="props.DOMId"
    v-loading="pageLoading"
    element-loading-text="Loading..."
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <el-scrollbar
      ref="scrollbarRef"
      :key="props.DOMId"
      v-if="showScroll"
      :height="scrollHeight"
      @scroll="onScroll"
    >
      <div class="img-box" v-if="pageData.length">
        <!-- 列表 -->
        <div class="img-item" v-for="info in pageData" :key="info.id">
          <el-tooltip :content="info.name" placement="top">
            <el-image
              lazy
              :src="info.src"
              fit="contain"
              style="width: 90px; height: 90px"
              :alt="info.name"
              @click="(e) => emit('click', { info, e })"
              @dragend="(e) => emit('dragend', { info, e })"
            />
          </el-tooltip>
        </div>
      </div>
      <el-divider v-if="isDownBottom">{{ pageData.length ? '已经到底了' : '暂无内容' }}</el-divider>
    </el-scrollbar>
  </div>
</template>

<script name="ImportJson" setup>
import { throttle } from 'lodash-es'
import usePageList from '@/hooks/usePageList'

const emit = defineEmits(['back', 'click', 'dragend'])

const props = defineProps({
  pageListApi: {
    type: Function
  },
  filters: {
    type: Object
  },
  DOMId: {
    type: String,
    default: ''
  },
  formatData: {
    type: Function
  }
})

const sort = []

// 通用分页
const {
  pageData,
  showScroll,
  scrollHeight,
  isDownBottom,
  pageLoading,
  startPage,
  startGetList,
  nextPage
} = usePageList({
  el: '#' + props.DOMId,
  apiClient: props.pageListApi,
  filters: props.filters,
  sort,
  fields: [],
  formatData: props.formatData
})

const scrollbarRef = ref()
const _scrollTop = ref(0)
const onScroll = throttle(function (options) {
  if (unref(pageLoading)) return
  const wrapRef = scrollbarRef.value.wrapRef
  scrollbarRef.value.moveY = (wrapRef.scrollTop * 100) / wrapRef.clientHeight
  scrollbarRef.value.moveX = (wrapRef.scrollLeft * 100) / wrapRef.clientWidth
  let poor = wrapRef.scrollHeight - wrapRef.clientHeight
  // 判断滚动到底部
  if (options.scrollTop + 2 >= poor) {
    _scrollTop.value = options.scrollTop
    console.log('daozdaozi dafjdakfj ')
    nextPage()
  }
}, 300)
onMounted(async () => {
  startPage()
})

defineExpose({
  startGetList,
  startPage
})
</script>
<style scoped lang="scss">
:deep(.el-scrollbar__view) {
  height: 100%;
}
.page-list-box {
  margin-top: 10px;
}
.img-box {
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  background: #f1f2f4;
  border-radius: 10px;
  margin-bottom: 10px;
  padding-right: 10px;
  .img-item {
    margin-bottom: 10px;
    border-radius: 5px;

    cursor: pointer;
    &:hover {
      background: #bababa;
    }
  }
}
</style>
