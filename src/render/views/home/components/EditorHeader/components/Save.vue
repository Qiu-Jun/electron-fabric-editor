<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2024-11-30 17:43:42
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="f-center pr-10px">
    <el-dropdown class="ml-10px" @command="saveWith">
      <el-button type="primary">
        {{ $t('editor.header.save.download') }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="saveMyClould">{{
            $t('editor.header.save.save_my_spase')
          }}</el-dropdown-item>
          <el-dropdown-item command="saveImg" divided>{{
            $t('editor.header.save.save_as_picture')
          }}</el-dropdown-item>
          <el-dropdown-item command="saveSvg">{{
            $t('editor.header.save.save_as_svg')
          }}</el-dropdown-item>
          <el-dropdown-item command="clipboard" divided>{{
            $t('editor.header.save.copy_to_clipboard')
          }}</el-dropdown-item>
          <el-dropdown-item command="clipboardBase64">{{
            $t('editor.header.save.copy_to_clipboardstr')
          }}</el-dropdown-item>
          <el-dropdown-item command="saveJson" divided>{{
            $t('editor.header.save.save_as_json')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ElLoading } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import useMaterial from '@/hooks/useMaterial'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
const route = useRoute()

const { createTmplByCommon, updataTemplInfo, routerToId } = useMaterial()

const { t } = useI18n()

const cbMap = {
  async clipboard() {
    try {
      await editorStore.editor.clipboard()
      ElMessage.success('复制成功')
    } catch (error) {
      ElMessage.error('复制失败')
    }
  },
  saveJson() {
    editorStore.editor.saveJson()
  },
  saveSvg() {
    editorStore.editor.saveSvg()
  },
  saveImg() {
    editorStore.editor.saveImg()
  },
  async clipboardBase64() {
    try {
      await editorStore.editor.clipboardBase64()
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
  editorStore.editor?.clear()
  editorStore.canvas.clearHistory()
  editorStore.editor?.historyUpdate()
}
</script>
