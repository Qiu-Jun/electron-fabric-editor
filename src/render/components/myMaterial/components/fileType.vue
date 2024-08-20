<!--
 * @Author: 秦少卫
 * @Date: 2024-05-30 10:03:30
 * @LastEditors: June
 * @LastEditTime: 2024-07-25 23:45:16
 * @Description: 文件夹
-->

<template>
  <div class="file-type-box">
    <img :src="fileTypeIcon" />
    <span>{{ props.name }}</span>
    <div class="click-bg" @click="emit('select')"></div>
    <div class="more">
      <el-dropdown trigger="click" @command="operation">
        <el-button size="small" shape="circle" text>
          <el-icon size="18px">
            <Plus />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="reName">重命名</el-dropdown-item>
            <el-dropdown-item command="delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup name="ImportTmpl">
import fileTypeIcon from '../../../assets/icon/fileType.png'
import useMaterial from '@/hooks/useMaterial'
import { Plus } from '@element-plus/icons-vue'

const { reNameFileType, removeFileType } = useMaterial()
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  itemId: {
    type: [Number, String],
    default: ''
  }
})

const emit = defineEmits(['change', 'select'])

const operation = (value) => {
  const mapActions = {
    reName: reNameFile,
    delete: deleteFile
  }
  mapActions[value]()
}
const fileName = ref('')

const reNameFile = () => {
  fileName.value = props.name
  ElMessageBox.confirm('重命名文件夹', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    message: () => {
      return h(ElInput, {
        ...ElInput.$el,
        ...ElInput.$attrs,
        size: 'large',
        modelValue: fileName.value,
        autofocus: true,
        style: {
          margin: '10px 0',
          width: '400px'
        },
        placeholder: '请输入文件夹名称',
        'onUpdate:modelValue': ($event) => {
          fileName.value = $event
        }
      })
    }
  }).then(async () => {
    if (fileName.value === '') {
      ElMessage.warning('文件夹名称不能为空')
      return
    }
    await reNameFileType(fileName.value, props.itemId)
    emit('change')
  })
}

const deleteFile = async () => {
  const res = await removeFileType(props.itemId)
  if (res?.data?.msg) {
    ElMessage.error({
      content: res.data?.msg,
      duration: 3
    })
    return
  }
  emit('change')
}
</script>

<style scoped lang="scss">
// 文件夹
.file-type-box {
  width: 134px;
  height: 116px;
  cursor: pointer;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // border: 1px solid #fff;
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  img {
    width: 60px;
    margin-top: 12px;
  }
  span {
    display: block;
    padding-top: 10px;
    text-align: center;
    width: 90%;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
  div.more {
    position: absolute;
    display: none;
  }

  .click-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:hover {
    background: rgb(243, 245, 249);
    border: 1px solid rgb(225, 230, 239);
    border-radius: 8px;
    img {
      opacity: 0.8;
    }
    div.more {
      display: block;
      top: 5px;
      right: 5px;
    }
  }
}
</style>
