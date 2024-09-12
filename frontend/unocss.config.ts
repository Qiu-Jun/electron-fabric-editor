/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 19:00:17
 * @LastEditors: June
 * @LastEditTime: 2023-11-01 12:33:32
 */
import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetTypography()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: '#409eff'
    }
  },
  shortcuts: [{ 'wh-full': 'w-full h-full' }, { 'f-center': 'flex justify-center items-center' }]
})
