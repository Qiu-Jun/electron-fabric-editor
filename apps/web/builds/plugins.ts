/*
 * @Description:
 * @Author: June
 * @Date: 2024-08-21 13:03:57
 * @LastEditTime: 2024-11-30 17:39:19
 * @LastEditors: June
 */
/*
 * @Description:
 * @Author: June
 * @Date: 2024-08-21 13:03:57
 * @LastEditTime: 2024-08-21 13:12:03
 * @LastEditors: June
 */
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as path from 'node:path'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { isProd } from './getEnv'

/**
 * 创建 vite 插件
 * @param viteEnv
 */
export function createVitePlugins(mode: string, command: string, viteEnv: any): (PluginOption | PluginOption[])[] {
  const _isProd = isProd(mode)
  const { APP_TITLE } = viteEnv
  const plugins: PluginOption | PluginOption[] = [
    vue({
      template: {
        compilerOptions: { isCustomElement: tag => tag.startsWith('wc-') },
      },
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: '../.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },

      dts: path.join(__dirname, '../types/auto-imports.d.ts'),
      imports: ['vue', 'vue-router', 'vue-i18n'],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: [path.join(__dirname, '../src/components')],
      dts: path.join(__dirname, '../types/components.d.ts'),
    }),
    createHtmlPlugin({
      minify: _isProd,
      inject: {
        data: {
          title: APP_TITLE,
        },
      },
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, '../src/assets/svgs')], // icon存放的目录
      symbolId: 'icon-[name]', // symbol的id
      inject: 'body-last', // 插入的位置
      customDomId: '__svg__icons__dom__', // svg的id
    }),
    Unocss(),
    vueJsx(),
  ]

  return plugins
}
