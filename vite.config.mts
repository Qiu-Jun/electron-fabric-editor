/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:41:24
 * @LastEditors: June
 * @LastEditTime: 2024-08-21 01:56:00
 */
import { defineConfig } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import electron from 'vite-plugin-electron'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Unocss from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { wrapperEnv, loadEnv } from './build/getEnv'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, `${root}/env`)!
  const viteEnv = wrapperEnv(env)
  const envPrefix = 'APP_'
  const plugins = [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },

      dts: path.join(root, './typings/auto-imports.d.ts'),
      imports: ['vue', 'vue-router', 'vue-i18n']
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: [path.join(root, 'src/render/components')],
      dts: path.join(root, './typings/components.d.ts')
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: viteEnv.APP_TITLE
        }
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(root, 'src/render/assets/svgs')], // icon存放的目录
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
          entry: path.resolve(__dirname, 'src/main/index.ts'),
          vite: {
            resolve: {
              alias: {
                '~': path.resolve(__dirname, 'src/main')
              }
            },
            build: {
              outDir: path.resolve(__dirname, 'dist-electron/main')
            }
          }
        },
        {
          entry: path.resolve(__dirname, 'src/preload/index.ts'),
          vite: {
            resolve: {
              alias: {
                '~': path.resolve(__dirname, 'src/main')
              }
            },
            build: {
              outDir: path.resolve(__dirname, 'dist-electron/preload')
            }
          }
        }
      ])
    )
  }
  return {
    root: path.resolve(__dirname, 'src/render'),
    base: './',
    publicDir: 'resources',
    plugins,
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/fontFile': {
          target: 'https://github.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fontFile/, '')
        }
      }
    },
    css: {
      // postcss: {
      //     plugins: [autoprefixer]
      // },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, 'src/render/styles/variable.less')}";`
        }
      }
    },
    envPrefix,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/render'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      },
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css', '.scss']
    },
    build: {
      outDir: path.resolve(__dirname, 'dist-electron/dist')
    }
  }
})
