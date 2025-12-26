<!--
 * @Author: 秦少卫
 * @Date: 2024-04-25 15:30:54
 * @LastEditors: June
 * @LastEditTime: 2024-11-24 09:38:15
 * @Description: 我的素材
-->

<template>
  <div class="my-material">
    <el-button
      class="w-full"
      :icon="UploadFilled"
      @click="uploadImgHandule"
      long
      type="primary"
    >
      {{ $t('common.upload.title') }}
    </el-button>
    <div class="img-group flex justify-start flex-wrap" v-if="fileList.length">
      <el-tooltip
        :content="info.name"
        v-for="(info, i) in fileList"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <div class="relative tmpl-img-box">
          <el-icon
            class="del-btn"
            color="red"
            @click="removeMaterialHandle(info.id)"
            ><Delete
          /></el-icon>
          <el-image
            lazy
            :src="info.imgUrl"
            fit="contain"
            height="100%"
            :alt="info.name"
            @click="addImgByElement"
          />
        </div>
      </el-tooltip>
    </div>
    <div class="tip" v-else>{{ $t('common.nomore') }}</div>
  </div>
</template>

<script setup name="ImportTmpl">
import { Delete, UploadFilled } from '@element-plus/icons-vue'
import {
  getFileList,
  uploadImg,
  createdMaterial,
  removeMaterial
} from '@/api/user'
import { Utils } from '@/lib/core'
import { apiHost } from '@/constants/app'
import { useEditorStore } from '@/store/modules/editor'

const { selectFiles } = Utils
const editorStore = useEditorStore()

const fileList = ref([])
const isLogin = ref(false)
const getFileListHandle = () => {
  // 获取素材列表
  getFileList()
    .then((res) => {
      fileList.value = res.data.data?.map((item) => {
        return {
          id: item.id,
          name: item?.attributes?.name,
          imgUrl: apiHost + item.attributes.img?.data?.attributes?.url
        }
      })
      console.log(fileList.value)
      isLogin.value = true
    })
    .catch((err) => {
      console.log(err)
      isLogin.value = false
    })
}

getFileListHandle()

// 上传素材
const uploadImgHandule = () => {
  selectFiles({
    accept: 'image/*'
  }).then((fileList) => {
    const formData = new FormData()
    const time = new Date()
    const [file] = fileList
    formData.append('files', file, `${time.getTime()}`)
    uploadImg(formData)
      .then((res) => {
        const [info] = res.data
        createdH(info.id, file.name)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
// 创建素材
const createdH = (id, fileName) => {
  createdMaterial({
    data: {
      img: id,
      name: fileName
    }
  }).finally(getFileListHandle)
}
// 添加素材到画布
const addImgByElement = async (e) => {
  const imgItem = await editorStore.editor.createImgByElement(e.target)
  editorStore.editor.addBaseType(imgItem, {
    scale: true
  })
}

// 删除素材
const removeMaterialHandle = (id) => {
  removeMaterial(id).finally(getFileListHandle)
}
</script>

<style scoped lang="scss">
.img-group {
  background: #eeeeeea1;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
}
.tmpl-img-box {
  box-sizing: border-box;
  width: 132px;
  height: 180px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;

  &:hover {
    background: #e3e3e3;
    .del-btn {
      // opacity: 1;
      right: 5px;
    }
  }
}

.del-btn {
  z-index: 1;
  position: absolute;
  top: 5px;
  right: 1000000px;
}

.tip {
  text-align: center;
  padding: 10px;
}
</style>
