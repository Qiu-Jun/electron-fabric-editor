<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-20 09:18:28
 * @LastEditors: June
 * @LastEditTime: 2024-11-29 12:15:33
-->
<template>
  <el-dropdown placement="bottom-end" @command="setLang">
    <el-button link>
      {{ lang }}
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in localeList"
          :key="lang.lang"
          :command="lang.lang"
        >
          <span class="f-center"> {{ lang.icon }} {{ lang.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { setLocal } from '@/utils/local'
import { LANG } from '../constants/app'
import { useI18n } from 'vue-i18n'
import { localeList } from '@/locales/config'

const { locale } = useI18n()

const LANGMAP: Record<string, string> = {
  zh_CN: '中文',
  en: 'En'
}

const lang = computed(() => {
  return LANGMAP[unref(locale)]
})

// 设置语言
const setLang = (_lang: string) => {
  locale.value = _lang
  setLocal(LANG, _lang)
}
</script>
