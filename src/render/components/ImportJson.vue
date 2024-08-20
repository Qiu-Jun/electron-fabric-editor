<template>
  <div class="f-center">
    <el-dropdown @command="clickHandler">
      <el-button link type="primary">
        {{ $t('importFiles.file') }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="createDesign">
            {{ $t('importFiles.createDesign.title') }}
          </el-dropdown-item>
          <el-dropdown-item command="importFiles">{{
            $t('importFiles.importFiles')
          }}</el-dropdown-item>
          <el-dropdown-item command="psd">PSD</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 创建设计 -->
    <ModalSize
      :title="$t('importFiles.createDesign.title')"
      ref="modalSizeRef"
      @set="customSizeCreate"
    ></ModalSize>
  </div>
</template>

<script name="ImportJson" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import useSelect from '@/hooks/select'
import useMaterial from '@/hooks/useMaterial'
import { ElMessage, ElLoading } from 'element-plus'
import ModalSize from './common/ModalSize.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { canvasEditor } = useSelect()
const { createTmpl, routerToId } = useMaterial()
const modalSizeRef = ref(null)

const clickHandler = (type) => {
  const handleMap = {
    // 导入文件
    importFiles: canvasEditor.insert,
    // 创建文件
    createDesign,
    // psd
    psd: async () => {
      //   const loadingInstance = ElLoading.service({
      //       fullscreen: true,
      //       text: t('alert.loading_data')
      //   })

      await canvasEditor.insertPSD()
    }
  }
  handleMap[type]?.()
}

const createDesign = () => {
  modalSizeRef.value.showSetSize()
}

const customSizeCreate = async (w, h) => {
  const res = await createTmpl(w, h)
  routerToId(res.data.data.id)
  ElMessage.success('创建成功')
}
</script>
