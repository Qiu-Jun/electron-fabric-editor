/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:41:24
 * @LastEditors: June
 * @LastEditTime: 2024-04-04 11:40:02
 */
import { defineConfig } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import electron from 'vite-plugin-electron'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Unocss from 'unocss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dotenv from "dotenv"
import fs from 'node:fs'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const envData = loadEnv(mode, process.cwd())
  dotenv.config(envData)
  const envPrefix = 'APP_'
  const plugins = [
    vue(),
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
          additionalData: `@import "${path.resolve(__dirname, 'src/styles/variable.less')}";`
        }
      }
    },
    envPrefix,
    resolve: {
      alias: [
        { find: /^@\//, replacement: path.resolve(__dirname, 'src') + '/' },
        { find: /^~/, replacement: '' },
        { find: /^vue-i18n/, replacement: 'vue-i18n/dist/vue-i18n.cjs.js' }
      ],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css']
    }
  }
})


function loadEnv(mode: string, envDir: string) {
  const envPath = `${envDir}/.env`;
  const localEnvPath = `${envDir}/.env.${mode}`;
 
  const _loadEnv = envPath => {
    const env = dotenv.config({ path: envPath });
    if (env.error) {
      throw new Error(`Failed to load env from ${envPath}: ${env.error}`);
    }
    return env.parsed;
  };
 
  const env = [localEnvPath, envPath]
    .filter(path => fs.existsSync(path))
    .map(path => _loadEnv(path));
 
  // 将加载的环境变量合并，并添加到Vite配置中
  return env.reduce((acc, envs) => ({ ...acc, ...envs }), {});
}
 