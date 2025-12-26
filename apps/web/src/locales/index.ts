/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-07 1ptions)5:41:56
 * @LastEditTime: 2024-11-23 16:23:29
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\locales\index.ts
 */
import { createI18n } from 'vue-i18n'
import { localeMap } from './config'
import type { App } from 'vue'
import { getLocal } from '@/utils/local'
import { LANG } from '@/constants/app'

let options: any = null
export let i18n: any = null

// setup i18n instance with global
export async function setupI18n(app: App) {
  const _i18n = await createI18nOptions()
  i18n = _i18n
  app.use(_i18n)
}

async function createI18nOptions() {
  const locale = getLocal(LANG) || 'zh_CN'
  const messages: Record<string, any> = {}
  const modules: any = import.meta.glob('./langs/*.ts', {
    eager: true
  })

  for (const path in modules) {
    const regex = /([^/]+)\.[^.]+$/
    const match = path.match(regex)
    if (match) {
      const name = match[1]
      messages[name] = modules[path].default?.message ?? {}
    }
  }

  options = {
    locale,
    legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
    fallbackLocale: 'zh_CN', // set fallback locale
    messages,
    globalInjection: true, // 全局注册$t方法
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false
  }
  return await createI18n(options)
}
