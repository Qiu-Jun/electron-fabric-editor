/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-25 01:37:09
 * @LastEditors: June
 * @LastEditTime: 2023-06-25 02:07:22
 */
import { createI18n } from 'vue-i18n'
import { zh, en } from './lang'
import { getLocal, setLocal } from '@/lib/local'
import { LANG } from '@/config/constants/app'

function getLocalLang() {
    let localLang = getLocal(LANG)
    if (!localLang) {
        let defaultLang = navigator.language
        if (defaultLang) {
            localLang = defaultLang = defaultLang.split('-')[0]
        }
        setLocal(LANG, defaultLang)
    }
    return localLang
}

const lang = getLocalLang()
const messages = {
    zh,
    en
}

const i18n = createI18n({
    locale: lang, // 设置语言类型
    legacy: false, // 如果要支持composition API，此项必须设置为false;
    globalInjection: true, // 全局注册$t方法
    messages
})

export default i18n
