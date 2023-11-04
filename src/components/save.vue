<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2023-11-01 12:10:51
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <Button type="text" @click="beforeClear">
      {{ $t('empty') }}
    </Button>
    <Dropdown class="ml-10px" @on-click="saveWith">
      <Button type="primary">
        {{ $t('keep') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="clipboard">{{ $t('copy_to_clipboard') }}</DropdownItem>
          <DropdownItem name="saveImg">{{ $t('save_as_picture') }}</DropdownItem>
          <DropdownItem name="saveSvg">{{ $t('save_as_svg') }}</DropdownItem>
          <DropdownItem name="saveJson" divided>{{ $t('save_as_json') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus'
import useSelect from '@/hooks/select'

import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
// import { downloadFile } from '@/utils/utils';

const { t } = useI18n()

const { canvasEditor } = useSelect()
const cbMap = {
  clipboard() {
    canvasEditor.clipboard()
  },

  saveJson() {
    canvasEditor.saveJson()
  },

  saveSvg() {
    canvasEditor.saveSvg()
  },

  saveImg() {
    canvasEditor.saveImg()
  }
}

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]()
}, 300)

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear()
}

const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear()
  })
}
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
