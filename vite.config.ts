/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:41:24
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 03:22:17
 */
import { defineConfig, loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import electron from 'vite-plugin-electron'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
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
            imports: ['vue', 'vue-router', 'vue-i18n'],
            eslintrc: {
                enabled: true
            },
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
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
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
            }
        }
    }
})
