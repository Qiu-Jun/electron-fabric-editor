<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 16:34:23
 * @LastEditors: June
 * @LastEditTime: 2024-10-09 21:22:56
 * @Description: 分页组件
-->

<script name="ImportJson" setup>
import { throttle } from 'lodash-es'
import usePageList from '@/hooks/usePageList'

const props = defineProps({
  pageListApi: {
    type: Function,
  },
  filters: {
    type: Object,
  },
  domId: {
    type: String,
    default: '',
  },
  formatData: {
    type: Function,
  },
})

const emit = defineEmits(['back', 'click', 'dragend'])

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
  nextPage,
} = usePageList({
  el: `#${props.domId}`,
  apiClient: props.pageListApi,
  filters: props.filters,
  sort,
  fields: [],
  formatData: props.formatData,
})

const scrollbarRef = ref()
const _scrollTop = ref(0)
const onScroll = throttle((options) => {
  if (unref(pageLoading))
    return
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
  startPage,
})
</script>

<template>
  <!-- 列表 -->
  <div
    :id="props.domId"
    v-loading="pageLoading"
    class="page-list-box"
    style="height: calc(100vh - 100px)"
    element-loading-text="Loading..."
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <el-scrollbar
      v-if="showScroll"
      ref="scrollbarRef"
      :key="props.domId"
      :height="scrollHeight"
      @scroll="onScroll"
    >
      <div v-if="pageData.length" class="img-box">
        <!-- 列表 -->
        <div v-for="info in pageData" :key="info.id" class="img-item">
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
      <el-divider v-if="isDownBottom">
        {{
          pageData.length ? '已经到底了' : '暂无内容'
        }}
      </el-divider>
    </el-scrollbar>
  </div>
</template>

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
