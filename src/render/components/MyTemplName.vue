<!--
 * @Author: 秦少卫
 * @Date: 2024-05-11 13:23:48
 * @LastEditors: June
 * @LastEditTime: 2024-07-24 20:24:38
 * @Description: 文件名称
-->

<template>
  <div style="display: inline-block" v-if="route?.query?.id">
    <el-input
      v-model="fileName"
      placeholder="请输入文件名称"
      style="width: 190px"
      size="small"
      @change="changeFileName"
      :loading="loading"
    />
    <el-button link @click="saveTempl" :loading="loading">
      222
      <!-- <Icon type="ios-cloud-done" :color="loading ? '#ff9900' : '#19be6b'" /> -->
    </el-button>
    <el-divider type="vertical" />
  </div>
</template>

<script name="ImportJson" setup>
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import useMaterial from '@/hooks/useMaterial'
import { useRoute, useRouter } from 'vue-router'
import useSelect from '@/hooks/select'
import { getTmplList } from '@/api/user'

import qs from 'qs'
import { onMounted } from 'vue'
const router = useRouter()
const { getTemplInfo, updataTemplInfo } = useMaterial()

const { canvasEditor } = useSelect()

const fileName = ref('')
const route = useRoute()
const loading = ref(false)

watch(
  () => route.query,
  (query) => {
    if (query?.id) {
      getTemplInfo(query?.id).then((res) => {
        fileName.value = res?.data?.attributes?.name
      })
    } else {
      fileName.value = false
    }
  }
)

onMounted(async () => {
  if (route?.query?.id) {
    getTemplInfo(route?.query?.id)
      .then((res) => {
        fileName.value = res?.data?.attributes?.name
        canvasEditor.loadJSON(JSON.stringify(res?.data?.attributes?.json))
      })
      .catch(() => {
        window.location.href = '/'
      })
  } else if (route?.query?.projectid) {
    const infoid = await queryTemplIdByProId(route?.query?.projectid)
    if (infoid) {
      getTemplInfo(infoid).then((res) => {
        router.replace(route.fullPath + '&id=' + infoid)
        fileName.value = res?.data?.attributes?.name
        canvasEditor.loadJSON(JSON.stringify(res?.data?.attributes?.json))
      })
    }
  }
})

const queryTemplIdByProId = (projectid) => {
  const query = {
    populate: {
      img: '*'
    },
    filters: {
      externalId: {
        $eq: String(projectid)
      }
    },
    pagination: {
      page: 1,
      pageSize: 50
    }
  }

  return getTmplList(qs.stringify(query))
    .then((res) => {
      if (res.data.data.length) {
        return res.data.data[0].id
      }
    })
    .catch((err) => {
      return err
    })
}

const saveTempl = () => {
  if (fileName.value === '') {
    ElMessage.warning('文件名称不能为空')
    fileName.value = '默认文件名称'
    return
  }
  loading.value = true
  updataTemplInfo(route.query.id, fileName.value)
    .then()
    .finally(() => {
      loading.value = false
    })
}

// canvasEditor
const changeFileName = debounce(() => {
  if (route.query.id) {
    saveTempl()
  }
}, 3000)
// 自动保存优化

onMounted(() => {
  canvasEditor.canvas?.on('object:modified', changeFileName)
})
</script>
<style scoped lang="scss">
h3 {
  margin-bottom: 10px;
}
.divider {
  margin-top: 0;
}
</style>
