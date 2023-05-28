/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 00:41:24
 * @LastEditors: June
 * @LastEditTime: 2023-04-01 17:39:19
 */
import { defineConfig, loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import electron from 'vite-plugin-electron'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
    const envData = loadEnv(mode, process.cwd())
    const plugins = [
        vue(),
        createHtmlPlugin({
            inject: {
                data: {
                    title: envData.VITE_APP_TITLE
                }
            }
        })
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
                '@': path.resolve(__dirname, 'src')
            }
        }
    }
})
