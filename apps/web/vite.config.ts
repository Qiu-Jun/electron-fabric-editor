import type { ConfigEnv, UserConfig } from 'vite'
import { join, resolve } from 'node:path'
/* eslint-env node */
import { defineConfig } from 'vite'
import { chrome } from '../electron/.electron-vendors.cache.json'
import { loadEnv, wrapperEnv } from './builds/getEnv'
import { exclude, include } from './builds/optimize'
import { createVitePlugins } from './builds/plugins'

const PACKAGE_ROOT = __dirname
// const PROJECT_ROOT = join(PACKAGE_ROOT, '../..')

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, `${root}/env`)!
  const viteEnv = wrapperEnv(env)
  const envPrefix = 'APP_'
  // const productRoot = join(root, '../..')
  console.log(PACKAGE_ROOT)
  return {
    root,
    base: './',
    envDir: './env',
    plugins: createVitePlugins(mode, command, viteEnv),
    css: {
    // postcss: {
    //     plugins: [autoprefixer]
    // },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${resolve(__dirname, 'src/styles/variable.less')}";`,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css', '.scss'],
    },
    envPrefix,
    optimizeDeps: { exclude, include },
    server: {
      fs: {
        strict: true,
      },
      host: '0.0.0.0',
      port: 3000,
      open: true,
      proxy: {
        '/fontFile': {
          target: 'https://github.com/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/fontFile/, ''),
        },
      },
    },
    build: {
      sourcemap: true,
      target: `chrome${chrome}`,
      outDir: 'dist',
      assetsDir: '.',
      rollupOptions: {
        input: join(PACKAGE_ROOT, 'index.html'),
      },
      emptyOutDir: true,
      reportCompressedSize: false,
    },
  }
})
