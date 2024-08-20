<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2024-08-21 01:30:24
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="f-center pr-10px">
    <el-button class="ml-10px" link type="primary" @click="beforeClear">
      {{ $t('save.empty') }}
    </el-button>
    <el-dropdown class="ml-10px" @command="saveWith">
      <el-button type="primary">
        {{ $t('save.down') }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="saveMyClould">{{ $t('save.save_my_spase') }}</el-dropdown-item>
          <el-dropdown-item command="saveImg" divided>{{
            $t('save.save_as_picture')
          }}</el-dropdown-item>
          <el-dropdown-item command="saveSvg">{{ $t('save.save_as_svg') }}</el-dropdown-item>
          <el-dropdown-item command="clipboard" divided>{{
            $t('save.copy_to_clipboard')
          }}</el-dropdown-item>
          <el-dropdown-item command="clipboardBase64">{{
            $t('save.copy_to_clipboardstr')
          }}</el-dropdown-item>
          <el-dropdown-item command="saveJson" divided>{{
            $t('save.save_as_json')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup name="save-bar">
import { ArrowDown } from '@element-plus/icons-vue'
import useSelect from '@/hooks/select'
import useMaterial from '@/hooks/useMaterial'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ElLoading } from 'element-plus'

const route = useRoute()

const { createTmplByCommon, updataTemplInfo, routerToId } = useMaterial()

const { t } = useI18n()

const { canvasEditor } = useSelect()
const cbMap = {
  async clipboard() {
    try {
      await canvasEditor.clipboard()
      ElMessage.success('复制成功')
    } catch (error) {
      ElMessage.error('复制失败')
    }
  },
  saveJson() {
    canvasEditor.saveJson()
  },
  saveSvg() {
    canvasEditor.saveSvg()
  },
  saveImg() {
    canvasEditor.saveImg()
  },
  async clipboardBase64() {
    try {
      await canvasEditor.clipboardBase64()
      ElMessage.success('复制成功')
    } catch (error) {
      ElMessage.error('复制失败')
    }
  },
  async saveMyClould() {
    const loadingInstance = ElLoading.service()
    try {
      if (route?.query?.id) {
        await updataTemplInfo(route?.query?.id)
      } else {
        const res = await createTmplByCommon()
        routerToId(res.data.data.id)
      }
    } catch (error) {
      console.log(error)
      ElMessage.warning('请登录')
    }
    loadingInstance.close()
  }
}

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]()
}, 300)

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor?.clear()
  canvasEditor.canvas.clearHistory()
  canvasEditor?.historyUpdate()
}

const beforeClear = () => {
  ElMessageBox.confirm(`${t('clearTip')}`, 'Warning', {
    title: t('tip'),
    type: 'warning',
    confirmButtonText: 'ok',
    cancelButtonText: t('cancel')
  }).then(clear)
}
</script>
