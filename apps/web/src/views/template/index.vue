<!--
 * @Author: June
 * @Description:
 * @Date: 2024-07-24 18:36:42
 * @LastEditors: June
 * @LastEditTime: 2024-11-22 08:04:17
 * @FilePath: \element-fabric-editor\src\views\template\index.vue
-->
<script name="Home" setup>
import { Search } from '@element-plus/icons-vue'
import { ElLoading } from 'element-plus'
import qs from 'qs'
import { useRouter } from 'vue-router'
import { getTmplList, getTmplTypes } from '@/api/material'
import Lang from '@/components/Lang.vue'
import Login from '@/components/Login.vue'
// 顶部组件
import Logo from '@/components/Logo.vue'
import { getMaterialPreviewUrl } from '@/hooks/usePageList'
// 路由
import Banner from './components/Banner.vue'

const router = useRouter()

// 分类列表
const typeList = ref([])
async function getTypeListHandel() {
  const res = await getTmplTypes()
  typeList.value = res.data.data.map((item) => {
    return {
      id: item.id,
      name: item.attributes.name,
    }
  })
}
getTypeListHandel()

// 模板列表
const templList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const filters = reactive({
  name: {
    $containsi: '',
  },
  templ_type: {
    $in: [],
  },
})

async function getTmplListHandel() {
  const params = {
    populate: {
      img: '*',
    },
    filters: toRaw(filters),
    fields: ['name'],
    pagination: {
      page: page.value,
      pageSize: pageSize.value,
    },
  }
  const loadingInstance = ElLoading.service()
  try {
    const res = await getTmplList(qs.stringify(params))
    templList.value = []
    await nextTick()
    total.value = res.data.meta.pagination.total
    templList.value = res.data.data.map(item => ({
      id: item.id,
      name: item.attributes.name,
      src: getMaterialPreviewUrl(item.attributes.img),
    }))
  }
  catch (error) {
    console.log(error)
  }
  loadingInstance.close()
}

function search() {
  page.value = 1
  getTmplListHandel()
}
getTmplListHandel()

function toInfo(info) {
  const href = router.resolve({
    path: '/',
    query: {
      tempId: info.id,
    },
  })
  console.log(href, 1111)
  // 点击事件
  window.open(href.href, '_blank')
}
</script>

<template>
  <div class="home">
    <el-container>
      <!-- 头部区域 -->
      <el-header :style="{ position: 'fixed', width: '100%', zIndex: 99 }">
        <div class="left">
          <Logo />
          <!-- 导入 -->
          <el-divider direction="vertical" />
          在线设计工具
        </div>

        <div class="right">
          <router-link
            v-slot="{ navigate }"
            custom
            to="/design/editor"
            target="_blank"
          >
            <el-button link @click="navigate">
              新建设计
            </el-button>
          </router-link>

          <el-divider direction="vertical" />

          <Login />
          <Lang />
        </div>
      </el-header>

      <!-- banner -->
      <el-main
        :style="{
          margin: '40px 20px 0',
          minHeight: '500px',
          minWidth: '1200px',
        }"
      >
        <Banner />
        <div class="search-box">
          <el-input
            v-model="filters.name.$containsi"
            size="large"
            class="search-input"
            clearable
            search
            enter-button
            placeholder="请输入关键词"
            @search="search"
          >
            <template #append>
              <el-button type="primary" :icon="Search" />
            </template>
          </el-input>
          <el-tabs v-model="filters.templ_type.$in" @tab-click="search">
            <el-tab-pane
              v-for="item in typeList"
              :key="item.id"
              :name="item.id"
              :label="item.name"
            />
          </el-tabs>
        </div>

        <!-- grid布局 -->
        <wc-waterfall :gap="10" :cols="5">
          <div
            v-for="info in templList"
            :key="info.id"
            class="img-item grid-item"
          >
            <el-tooltip :content="info.name" placement="top">
              <img :src="info.src" :alt="info.name" @click="toInfo(info)">
            </el-tooltip>
          </div>
        </wc-waterfall>
        <Page
          v-model="page"
          class="page"
          :total="total"
          :page-size="pageSize"
          show-sizer
          @on-change="getTmplListHandel"
          @on-page-size-change="(val) => (pageSize = val)"
        />
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
// header
:deep(.el-header) {
  --height: 45px;
  padding: 0 0px;
  border-bottom: 1px solid #eef2f8;
  background: #fff;
  height: var(--height);
  line-height: var(--height);
  display: flex;
  justify-content: space-between;

  .left,
  .right {
    display: flex;
    align-items: center;
    img {
      display: block;
      margin-right: 10px;
    }
  }
}

// footer
.layout-footer-center {
  text-align: center;
}

// 搜索弹框
.search-box {
  width: 1200px;
  margin: 20px auto;
  border-radius: 10px;
  background: #ffffffed;
  padding: 20px;
  border: 2px solid #fff;
}

// 流布局
.img-box {
  @apply grid w-1200px mx-auto;
  .grid-item {
    @apply w-232px cursor-pointer mb-5px;
    img {
      @apply w-full rounded-10px;
      &:hover {
        // animation: 3s linear 1s slidein;
        transform: scale(1.02);
      }
    }
  }
}

// 分页
.page {
  @apply my-20px mx-auto text-center;
}
</style>
