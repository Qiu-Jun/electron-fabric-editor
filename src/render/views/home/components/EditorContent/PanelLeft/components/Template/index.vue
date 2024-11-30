<template>
  <div class="box-border p-10px">
    <!-- 搜索组件 -->
    <div class="search-box">
      <el-select
        class="select"
        v-model="typeValue"
        @change="onSelectChange"
        :disabled="pageLoading"
        placeholder="请选择"
      >
        <el-option
          v-for="item in typeList"
          :value="item.value"
          :label="item.label"
          :key="item.value"
        />
      </el-select>
      <el-input
        class="input"
        :placeholder="`在${typeText}中搜索`"
        v-model="searchKeyWord"
        search
        :disabled="pageLoading"
        @keyup.enter="startGetList"
      />
    </div>
    <!-- 列表 -->
    <div
      style="height: calc(100vh - 108px)"
      id="myTemplBox"
      v-loading="pageLoading"
    >
      <el-scrollbar
        ref="scrollbarRef"
        key="mysscroll"
        v-if="showScroll"
        @scroll="onScroll"
        :height="scrollHeight"
      >
        <!-- 列表 -->
        <wc-waterfall :gap="10" :cols="2">
          <el-tooltip
            :content="info.name"
            v-for="info in pageData"
            :key="info.src"
            placement="top"
          >
            <div class="tmpl-img-box">
              <el-image
                :src="info.previewSrc"
                fit="contain"
                height="100%"
                :alt="info.name"
                @click="beforeClearTip(info)"
              />
            </div>
          </el-tooltip>
        </wc-waterfall>

        <el-divider v-if="isDownBottm">已经到底了</el-divider>
      </el-scrollbar>
    </div>
  </div>
</template>

<script name="ImportTmpl" setup>
import usePageList from '@/hooks/pageList'
import { ElLoading, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { debounce, throttle } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const {
  startPage,
  typeValue,
  typeText,
  typeList,
  pageLoading,
  pageData,
  searchKeyWord,
  isDownBottm,
  startGetList,
  nextPage,
  showScroll,
  scrollHeight,
  getInfo
} = usePageList({
  typeUrl: 'templ-types',
  listUrl: 'templs',
  searchTypeKey: 'templ_type',
  searchWordKey: 'name',
  pageSize: 10,
  scrollElement: '#myTemplBox',
  fields: ['name']
})

typeValue.value = 4

// 替换提示
const beforeClearTip = (info) => {
  ElMessageBox({
    title: t('common.tip'),
    message: `${t('editor.tip.replaceTip')}`,
    showCancelButton: true,
    confirmButtonText: t('common.okText'),
    cancelButtonText: t('common.cancelText')
  }).then(() => getTempData(info))
}

// 获取模板数据
const getTempData = async (info) => {
  const loadingInstance = ElLoading.service({
    text: t('common.loadingText')
  })
  const infoRes = await getInfo(info.id)
  if (route.query.admin) {
    router.replace('/?tempId=' + info.id + '&admin=true')
  } else {
    router.replace('/?tempId=' + info.id)
  }
  editorStore.editor.loadJSON(
    JSON.stringify(infoRes.data.data.attributes.json),
    loadingInstance?.close()
  )
}

const onSelectChange = debounce(startGetList, 200)

const getTemplInfo = async () => {
  if (route.query.tempId) {
    try {
      const loadingInstance = ElLoading.service({
        text: t('common.loadingText')
      })
      const infoRes = await getInfo(route.query.tempId)
      editorStore.editor.loadJSON(
        JSON.stringify(infoRes.data.data.attributes.json),
        loadingInstance?.close()
      )
    } catch (error) {
      console.log(error)
    }
  }
}
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
    nextPage()
  }
}, 300)
onMounted(() => {
  startPage()
  getTemplInfo()
})
</script>

<style scoped lang="scss">
.search-box {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  .input {
    margin-left: 10px;
  }
  .select {
    width: 100px;
  }
}

.tmpl-img-box {
  width: 140px;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  &:hover {
    :deep(.el-image) {
      opacity: 0.8;
    }
  }
}
</style>
