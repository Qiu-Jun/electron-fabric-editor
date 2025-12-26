/*
 * @Author: June
 * @Description:
 * @Date: 2024-11-02 22:08:42
 * @LastEditors: June
 * @LastEditTime: 2024-11-23 10:29:50
 */
import { genMessage } from '../helper'

const modulesFiles = import.meta.glob<any>('./en/**/*.json', {
  eager: true
})

export default {
  message: {
    ...genMessage(modulesFiles, 'en')
  },
  dateLocale: null,
  dateLocaleName: 'en'
}
