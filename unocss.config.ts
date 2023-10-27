/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 19:00:17
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 23:27:40
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
  }
})
