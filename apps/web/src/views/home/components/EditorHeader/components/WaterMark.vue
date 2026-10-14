<!--
 * @Author: June
 * @Description: 水印配置入口：配置文字/位置/字号/颜色并应用到画布
 * @Date: 2026-09-04 18:40:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 18:40:00
-->
<template>
  <el-popover v-model:visible="visible" trigger="click" :width="304">
    <template #reference>
      <el-button link type="primary">
        {{ $t('editor.header.waterMark.title') }}
      </el-button>
    </template>
    <div class="water-mark-form">
      <div class="form-item">
        <span class="label">{{ $t('editor.header.waterMark.text') }}</span>
        <el-input
          v-model="form.text"
          size="small"
          :maxlength="50"
          :placeholder="$t('editor.header.waterMark.textPlaceholder')"
        />
      </div>
      <div class="form-item">
        <span class="label">{{ $t('editor.header.waterMark.position') }}</span>
        <el-radio-group v-model="form.position" size="small">
          <el-radio-button value="Left_Top">
            {{ $t('editor.header.waterMark.posLt') }}
          </el-radio-button>
          <el-radio-button value="Right_Top">
            {{ $t('editor.header.waterMark.posRt') }}
          </el-radio-button>
          <el-radio-button value="Left_Bottom">
            {{ $t('editor.header.waterMark.posLb') }}
          </el-radio-button>
          <el-radio-button value="Right_Bottom">
            {{ $t('editor.header.waterMark.posRb') }}
          </el-radio-button>
          <el-radio-button value="Full">
            {{ $t('editor.header.waterMark.posFull') }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="form-item">
        <span class="label">{{ $t('editor.header.waterMark.size') }}</span>
        <el-input-number
          v-model="form.size"
          size="small"
          :min="12"
          :max="100"
        />
        <span class="label ml-10px">{{
          $t('editor.header.waterMark.color')
        }}</span>
        <el-color-picker
          v-model="form.color"
          size="small"
          :predefine="predefineColors"
        />
      </div>
      <div class="form-item">
        <span class="label">{{ $t('editor.header.waterMark.rotate') }}</span>
        <el-switch
          v-model="form.isRotate"
          :disabled="form.position !== 'Full'"
        />
        <span v-if="form.position !== 'Full'" class="tip">
          {{ $t('editor.header.waterMark.posFull') }}
        </span>
      </div>
      <div class="form-footer">
        <el-button size="small" :disabled="!hasWaterMark" @click="handleClear">
          {{ $t('editor.header.waterMark.clear') }}
        </el-button>
        <el-button size="small" type="primary" @click="handleApply">
          {{ $t('editor.header.waterMark.apply') }}
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useEditorStore } from '@/store/modules/editor'

interface IWaterMarkForm {
  text: string
  position: 'Left_Top' | 'Left_Bottom' | 'Right_Top' | 'Right_Bottom' | 'Full'
  size: number
  color: string
  isRotate: boolean
}

const { t } = useI18n()
const editorStore = useEditorStore()

const visible = ref(false)
const hasWaterMark = ref(false)

const form = reactive<IWaterMarkForm>({
  text: '',
  position: 'Left_Top',
  size: 24,
  color: '#cccccc',
  isRotate: false
})

// 常用水印色
const predefineColors = ['#cccccc', '#ffffff', '#000000', '#ff4d4f', '#faad14']

const handleApply = () => {
  if (!form.text.trim()) {
    ElMessage.warning(t('editor.header.waterMark.textPlaceholder'))
    return
  }
  editorStore.editor?.drawWaterMark({ ...form })
  hasWaterMark.value = true
  visible.value = false
}

const handleClear = () => {
  editorStore.editor?.clearWaterMark()
  hasWaterMark.value = false
  visible.value = false
}
</script>

<style lang="scss" scoped>
.water-mark-form {
  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .label {
      flex: 0 0 64px;
      font-size: 12px;
      color: #606266;
    }

    .tip {
      margin-left: 8px;
      font-size: 12px;
      color: #909399;
    }

    :deep(.el-radio-group) {
      flex: 1;
      .el-radio-button {
        flex: 1;
        .el-radio-button__inner {
          width: 100%;
          padding: 5px 0;
          font-size: 12px;
        }
      }
    }
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px solid #eef2f8;
  }
}
</style>
