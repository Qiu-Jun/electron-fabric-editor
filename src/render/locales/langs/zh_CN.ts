/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-30 12:15:37
 * @LastEditTime: 2024-11-23 10:30:04
 * @LastEditors: June
 * @FilePath: \ai-desing\src\locales\lang\zh_CN.ts
 */
import { genMessage } from '../helper'
import { Recordable } from 'typings/global'

const modulesFiles = import.meta.glob<Recordable>('./zh-CN/**/*.json', {
  eager: true
})

export default {
  message: {
    ...genMessage(modulesFiles, 'zh-CN')
  }
}
