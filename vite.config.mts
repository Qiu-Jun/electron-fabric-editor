/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:41:24
 * @LastEditors: June
 * @LastEditTime: 2024-08-21 13:16:30
 */
import { defineConfig } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import * as path from 'path'
import { exclude, include } from './build/optimize'
import { createVitePlugins } from './build/plugins'
import { wrapperEnv, loadEnv } from './build/getEnv'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, `${root}/env`)!
  const viteEnv = wrapperEnv(env)
  const envPrefix = 'APP_'

  return {
    root: path.resolve(__dirname, 'src/render'),
    base: './',
    publicDir: 'resources',
    plugins: createVitePlugins(mode, command, viteEnv),
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
    optimizeDeps: { include, exclude },
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
