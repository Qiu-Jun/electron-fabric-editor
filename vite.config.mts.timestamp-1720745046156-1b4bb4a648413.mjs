// vite.config.mts
import { defineConfig } from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/vite@5.3.3_@types+node@18.15.0_less@4.2.0_sass@1.58.3_terser@5.22.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/@vitejs+plugin-vue@4.0.0_vite@5.3.3_@types+node@18.15.0_less@4.2.0_sass@1.58.3_terser@5.22.0__vue@3.2.47/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import * as path from "path";
import { createHtmlPlugin } from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.3.3_@types+node@18.15.0_less@4.2.0_sass@1.58.3_terser@5.22.0_/node_modules/vite-plugin-html/dist/index.mjs";
import electron from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/vite-plugin-electron@0.28.7/node_modules/vite-plugin-electron/dist/index.mjs";
import AutoImport from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/unplugin-auto-import@0.16.2_@vueuse+core@10.2.0_vue@3.2.47__rollup@4.18.0/node_modules/unplugin-auto-import/dist/vite.js";
import { createSvgIconsPlugin } from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.3.3_@types+node@18.15.0_less@4.2.0_sass@1.58.3_terser@5.22.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import Unocss from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/unocss@0.61.0_postcss@5.2.18_rollup@4.18.0_vite@5.3.3_@types+node@18.15.0_less@4.2.0_sass@1.58.3_terser@5.22.0_/node_modules/unocss/dist/vite.mjs";
import vueJsx from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.1_vite@5.3.3_@types+node@18.15.0_less@4.2.0_sass@1.58.3_terser@5.22.0__vue@3.2.47/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import dotenv from "file:///D:/github/electron-fabric-editor/node_modules/.pnpm/dotenv@16.4.5/node_modules/dotenv/lib/main.js";
import fs from "node:fs";
var __vite_injected_original_dirname = "D:\\github\\electron-fabric-editor";
var vite_config_default = defineConfig(({ command, mode }) => {
  const envData = loadEnv(mode, process.cwd());
  console.log(envData);
  dotenv.config(envData);
  const envPrefix = "APP_";
  const plugins = [
    vue(),
    AutoImport({
      // 处理eslint 配置打开运行一次，生产后关闭
      eslintrc: {
        enabled: true,
        // Default `false`
        filepath: "./.eslintrc-auto-import.json",
        // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true
        // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      dts: "./dts/auto-imports.d.ts",
      imports: ["vue", "vue-router", "vue-i18n"]
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: envData.APP_TITLE
        }
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/svg")],
      // icon存放的目录
      symbolId: "icon-[name]",
      // symbol的id
      inject: "body-last",
      // 插入的位置
      customDomId: "__svg__icons__dom__"
      // svg的id
    }),
    Unocss(),
    vueJsx()
  ];
  if (command === "serve" && mode === "develectron") {
    plugins.push(
      electron([
        {
          entry: "electron/main/index.ts",
          vite: {
            build: {
              outDir: "dist-electron/main"
            }
          }
        },
        {
          entry: "electron/preload/index.ts",
          vite: {
            build: {
              outDir: "dist-electron/preload"
            }
          }
        }
      ])
    );
  }
  return {
    base: "./",
    publicDir: "resources",
    plugins,
    server: {
      port: 3e3,
      open: true,
      proxy: {
        "/fontFile": {
          target: "https://github.com/",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/fontFile/, "")
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
          additionalData: `@import "${path.resolve(__vite_injected_original_dirname, "src/styles/variable.less")}";`
        }
      }
    },
    envPrefix,
    resolve: {
      alias: [
        { find: /^@\//, replacement: path.resolve(__vite_injected_original_dirname, "src") + "/" },
        { find: /^~/, replacement: "" },
        { find: /^vue-i18n/, replacement: "vue-i18n/dist/vue-i18n.cjs.js" }
      ],
      extensions: [".ts", ".tsx", ".js", ".mjs", ".vue", ".json", ".less", ".css"]
    }
  };
});
function loadEnv(mode, envDir) {
  const envPath = `${envDir}/.env`;
  const localEnvPath = `${envDir}/.env.${mode}`;
  const _loadEnv = (envPath2) => {
    const env2 = dotenv.config({ path: envPath2 });
    if (env2.error) {
      throw new Error(`Failed to load env from ${envPath2}: ${env2.error}`);
    }
    return env2.parsed;
  };
  const env = [localEnvPath, envPath].filter((path2) => fs.existsSync(path2)).map((path2) => _loadEnv(path2));
  return env.reduce((acc, envs) => ({ ...acc, ...envs }), {});
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcZ2l0aHViXFxcXGVsZWN0cm9uLWZhYnJpYy1lZGl0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGdpdGh1YlxcXFxlbGVjdHJvbi1mYWJyaWMtZWRpdG9yXFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovZ2l0aHViL2VsZWN0cm9uLWZhYnJpYy1lZGl0b3Ivdml0ZS5jb25maWcubXRzXCI7LypcclxuICogQEF1dGhvcjogSnVuZVxyXG4gKiBARGVzY3JpcHRpb246XHJcbiAqIEBEYXRlOiAyMDIzLTAzLTExIDAwOjQxOjI0XHJcbiAqIEBMYXN0RWRpdG9yczogSnVuZVxyXG4gKiBATGFzdEVkaXRUaW1lOiAyMDI0LTA0LTA0IDExOjQwOjAyXHJcbiAqL1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdHlwZSB7IFVzZXJDb25maWcsIENvbmZpZ0VudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1odG1sJ1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAndml0ZS1wbHVnaW4tZWxlY3Ryb24nXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xyXG5pbXBvcnQgVW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCBkb3RlbnYgZnJvbSBcImRvdGVudlwiXHJcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZyA9PiB7XHJcbiAgY29uc3QgZW52RGF0YSA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSlcclxuICBjb25zb2xlLmxvZyhlbnZEYXRhKVxyXG4gIGRvdGVudi5jb25maWcoZW52RGF0YSlcclxuICBjb25zdCBlbnZQcmVmaXggPSAnQVBQXydcclxuICBjb25zdCBwbHVnaW5zID0gW1xyXG4gICAgdnVlKCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgLy8gXHU1OTA0XHU3NDA2ZXNsaW50IFx1OTE0RFx1N0Y2RVx1NjI1M1x1NUYwMFx1OEZEMFx1ODg0Q1x1NEUwMFx1NkIyMVx1RkYwQ1x1NzUxRlx1NEVBN1x1NTQwRVx1NTE3M1x1OTVFRFxyXG4gICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIERlZmF1bHQgYGZhbHNlYFxyXG4gICAgICAgIGZpbGVwYXRoOiAnLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbicsIC8vIERlZmF1bHQgYC4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25gXHJcbiAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZSAvLyBEZWZhdWx0IGB0cnVlYCwgKHRydWUgfCBmYWxzZSB8ICdyZWFkb25seScgfCAncmVhZGFibGUnIHwgJ3dyaXRhYmxlJyB8ICd3cml0ZWFibGUnKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgZHRzOiAnLi9kdHMvYXV0by1pbXBvcnRzLmQudHMnLFxyXG4gICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3Z1ZS1pMThuJ11cclxuICAgIH0pLFxyXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XHJcbiAgICAgIGluamVjdDoge1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHRpdGxlOiBlbnZEYXRhLkFQUF9USVRMRVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL3N2ZycpXSwgLy8gaWNvblx1NUI1OFx1NjUzRVx1NzY4NFx1NzZFRVx1NUY1NVxyXG4gICAgICBzeW1ib2xJZDogJ2ljb24tW25hbWVdJywgLy8gc3ltYm9sXHU3Njg0aWRcclxuICAgICAgaW5qZWN0OiAnYm9keS1sYXN0JywgLy8gXHU2M0QyXHU1MTY1XHU3Njg0XHU0RjREXHU3RjZFXHJcbiAgICAgIGN1c3RvbURvbUlkOiAnX19zdmdfX2ljb25zX19kb21fXycgLy8gc3ZnXHU3Njg0aWRcclxuICAgIH0pLFxyXG4gICAgVW5vY3NzKCksXHJcbiAgICB2dWVKc3goKVxyXG4gIF1cclxuICBpZiAoY29tbWFuZCA9PT0gJ3NlcnZlJyAmJiBtb2RlID09PSAnZGV2ZWxlY3Ryb24nKSB7XHJcbiAgICBwbHVnaW5zLnB1c2goXHJcbiAgICAgIGVsZWN0cm9uKFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBlbnRyeTogJ2VsZWN0cm9uL21haW4vaW5kZXgudHMnLFxyXG4gICAgICAgICAgdml0ZToge1xyXG4gICAgICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vbWFpbidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9wcmVsb2FkL2luZGV4LnRzJyxcclxuICAgICAgICAgIHZpdGU6IHtcclxuICAgICAgICAgICAgYnVpbGQ6IHtcclxuICAgICAgICAgICAgICBvdXREaXI6ICdkaXN0LWVsZWN0cm9uL3ByZWxvYWQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIF0pXHJcbiAgICApXHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiAnLi8nLFxyXG4gICAgcHVibGljRGlyOiAncmVzb3VyY2VzJyxcclxuICAgIHBsdWdpbnMsXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAnL2ZvbnRGaWxlJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9naXRodWIuY29tLycsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZm9udEZpbGUvLCAnJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgLy8gcG9zdGNzczoge1xyXG4gICAgICAvLyAgICAgcGx1Z2luczogW2F1dG9wcmVmaXhlcl1cclxuICAgICAgLy8gfSxcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIGxlc3M6IHtcclxuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwiJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3N0eWxlcy92YXJpYWJsZS5sZXNzJyl9XCI7YFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGVudlByZWZpeCxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IFtcclxuICAgICAgICB7IGZpbmQ6IC9eQFxcLy8sIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJykgKyAnLycgfSxcclxuICAgICAgICB7IGZpbmQ6IC9efi8sIHJlcGxhY2VtZW50OiAnJyB9LFxyXG4gICAgICAgIHsgZmluZDogL152dWUtaTE4bi8sIHJlcGxhY2VtZW50OiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5janMuanMnIH1cclxuICAgICAgXSxcclxuICAgICAgZXh0ZW5zaW9uczogWycudHMnLCAnLnRzeCcsICcuanMnLCAnLm1qcycsICcudnVlJywgJy5qc29uJywgJy5sZXNzJywgJy5jc3MnXVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcblxyXG5mdW5jdGlvbiBsb2FkRW52KG1vZGU6IHN0cmluZywgZW52RGlyOiBzdHJpbmcpIHtcclxuICBjb25zdCBlbnZQYXRoID0gYCR7ZW52RGlyfS8uZW52YDtcclxuICBjb25zdCBsb2NhbEVudlBhdGggPSBgJHtlbnZEaXJ9Ly5lbnYuJHttb2RlfWA7XHJcbiBcclxuICBjb25zdCBfbG9hZEVudiA9IGVudlBhdGggPT4ge1xyXG4gICAgY29uc3QgZW52ID0gZG90ZW52LmNvbmZpZyh7IHBhdGg6IGVudlBhdGggfSk7XHJcbiAgICBpZiAoZW52LmVycm9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgZW52IGZyb20gJHtlbnZQYXRofTogJHtlbnYuZXJyb3J9YCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW52LnBhcnNlZDtcclxuICB9O1xyXG4gXHJcbiAgY29uc3QgZW52ID0gW2xvY2FsRW52UGF0aCwgZW52UGF0aF1cclxuICAgIC5maWx0ZXIocGF0aCA9PiBmcy5leGlzdHNTeW5jKHBhdGgpKVxyXG4gICAgLm1hcChwYXRoID0+IF9sb2FkRW52KHBhdGgpKTtcclxuIFxyXG4gIC8vIFx1NUMwNlx1NTJBMFx1OEY3RFx1NzY4NFx1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRlx1NTQwOFx1NUU3Nlx1RkYwQ1x1NUU3Nlx1NkRGQlx1NTJBMFx1NTIzMFZpdGVcdTkxNERcdTdGNkVcdTRFMkRcclxuICByZXR1cm4gZW52LnJlZHVjZSgoYWNjLCBlbnZzKSA9PiAoeyAuLi5hY2MsIC4uLmVudnMgfSksIHt9KTtcclxufVxyXG4gIl0sCiAgIm1hcHBpbmdzIjogIjtBQU9BLFNBQVMsb0JBQW9CO0FBRTdCLE9BQU8sU0FBUztBQUNoQixZQUFZLFVBQVU7QUFDdEIsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sUUFBUTtBQWxCZixJQUFNLG1DQUFtQztBQW9CekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBNkI7QUFDeEUsUUFBTSxVQUFVLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUMzQyxVQUFRLElBQUksT0FBTztBQUNuQixTQUFPLE9BQU8sT0FBTztBQUNyQixRQUFNLFlBQVk7QUFDbEIsUUFBTSxVQUFVO0FBQUEsSUFDZCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUE7QUFBQSxNQUVULFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQTtBQUFBLFFBQ1QsVUFBVTtBQUFBO0FBQUEsUUFDVixrQkFBa0I7QUFBQTtBQUFBLE1BQ3BCO0FBQUEsTUFFQSxLQUFLO0FBQUEsTUFDTCxTQUFTLENBQUMsT0FBTyxjQUFjLFVBQVU7QUFBQSxJQUMzQyxDQUFDO0FBQUEsSUFDRCxpQkFBaUI7QUFBQSxNQUNmLFFBQVE7QUFBQSxRQUNOLE1BQU07QUFBQSxVQUNKLE9BQU8sUUFBUTtBQUFBLFFBQ2pCO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QscUJBQXFCO0FBQUEsTUFDbkIsVUFBVSxDQUFNLGFBQVEsUUFBUSxJQUFJLEdBQUcsZ0JBQWdCLENBQUM7QUFBQTtBQUFBLE1BQ3hELFVBQVU7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
