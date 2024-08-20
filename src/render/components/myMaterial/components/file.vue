<template>
  <el-tooltip :content="props.name" placement="top">
    <div class="file-type-box">
      <el-image
        lazy
        @click="beforeClearTip"
        :src="props.src"
        fit="contain"
        height="100%"
        width="100%"
        :alt="props.name"
      />
      <div class="more">
        <el-dropdown trigger="click" @command="operation">
          <el-button size="small" shape="circle" text>
            <el-icon size="24px">
              <Plus />
            </el-icon>
          </el-button>
          <template #list>
            <el-dropdown-menu>
              <el-dropdown-item command="reName">重命名</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
              <el-dropdown-item command="transfer">迁移目录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-tooltip>
  <!-- 迁移文件夹 -->
  <el-dialog v-model="modalVisable" title="请选择迁移目录">
    <el-tree-select v-model="fileTypeId" :data="treeData" width="200px" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="modalVisable = false">取消</el-button>
        <el-button type="primary" @click="transferRequest"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
  <!--  -->
</template>

<script setup name="ImportTmpl">
import { Plus } from '@element-plus/icons-vue'
import useMaterial from '@/hooks/useMaterial'
import { useI18n } from 'vue-i18n'
import useSelect from '@/hooks/select'
import { getUserFileTypeTree, updataTempl } from '@/api/user'
import { ElMessageBox, ElLoading, ElMessage } from 'element-plus'
const { t } = useI18n()
const { canvasEditor } = useSelect()
const { reNameFileType, removeTemplInfo, routerToId, getTemplInfo } = useMaterial()

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  src: {
    type: String,
    default: ''
  },
  previewSrc: {
    type: String,
    default: ''
  },
  itemId: {
    type: [Number, String],
    default: ''
  },
  json: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['change'])

const operation = (value) => {
  const mapActions = {
    reName: reNameFile,
    delete: deleteFile,
    transfer: transfer
  }
  mapActions[value]()
}
const fileName = ref('')

const reNameFile = () => {
  fileName.value = props.name
  ElMessageBox.confirm({
    title: '重命名',
    message: h(ElInput, {
      ...ElInput.$el,
      ...ElInput.$attrs,
      size: 'large',
      modelValue: fileName.value,
      autofocus: true,
      placeholder: '请输入文件名称',
      'onUpdate:modelValue': ($event) => {
        fileName.value = $event
      }
    })
  }).then(async () => {
    if (fileName.value === '') {
      ElMessage.warning('文件名称不能为空')
      return
    }
    await reNameFileType(fileName.value, props.itemId)
    emit('change')
  })
}

const deleteFile = async () => {
  await removeTemplInfo(props.itemId)
  emit('change')
}

const beforeClearTip = () => {
  ElMessageBox.confirm(t('replaceTip'), t('tip'), {
    confirmButtonText: t('ok'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(() => {
    getTempData()
  })
}

// 获取模板数据
const getTempData = async () => {
  const loadingInstance = ElLoading.service({
    text: t('alert.loading_data')
  })
  const data = await getTemplInfo(props.itemId)
  routerToId(props.itemId)
  canvasEditor.loadJSON(JSON.stringify(data.data.attributes.json), loadingInstance.close)
}

const modalVisable = ref(false)
const fileTypeId = ref('')
const treeData = ref([])

const transfer = async () => {
  treeData.value = []
  fileTypeId.value = ''
  const res = await getUserFileTypeTree()
  treeData.value = [res.data.data]
  modalVisable.value = true
}

const transferRequest = async () => {
  const parentId = fileTypeId.value === 'root' ? '' : fileTypeId.value
  await updataTempl(props.itemId, {
    data: {
      parentId: String(parentId)
    }
  })
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
  border: 1px solid #f1f1f1;
  border-radius: 10px;
  img {
    width: 60px;
    margin-top: 12px;
  }
  div.more {
    position: absolute;
    display: none;
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
