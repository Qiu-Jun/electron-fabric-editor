/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:41:24
 * @LastEditors: June
 * @LastEditTime: 2023-11-01 12:22:29
 */
import { defineConfig, loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import electron from 'vite-plugin-electron'
import AutoImport from 'unplugin-auto-import/vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Unocss from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const envData = loadEnv(mode, process.cwd())
  const plugins = [
    vue(),
    vueSetupExtend(),
    AutoImport({
      // 处理eslint 配置打开运行一次，生产后关闭
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },

      dts: './dts/auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'vue-i18n']
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: envData.VITE_APP_TITLE
        }
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')], // icon存放的目录
      symbolId: 'icon-[name]', // symbol的id
      inject: 'body-last', // 插入的位置
      customDomId: '__svg__icons__dom__' // svg的id
    }),
    Unocss(),
    vueJsx()
  ]
  if (command === 'serve' && mode === 'develectron') {
    plugins.push(
      electron([
        {
          entry: 'electron/main/index.ts',
          vite: {
            build: {
              outDir: 'dist-electron/main'
            }
          }
        },
        {
          entry: 'electron/preload/index.ts',
          vite: {
            build: {
              outDir: 'dist-electron/preload'
            }
          }
        }
      ])
    )
  }
  return {
    base: './',
    plugins,
    css: {
      // postcss: {
      //     plugins: [autoprefixer]
      // },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, 'src/styles/variable.less')}";`
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    }
  }
})
