<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-12 22:16:24
 * @LastEditors: June
 * @LastEditTime: 2023-03-17 10:57:16
-->

## electron-vite-template

基于 vite 的 electron 空白脚手架, 可以把 src 换成 react，替换掉 react 对应的库即可

## 目录结构

-   electron 主进程
    -   main
        -   modules 主进程的一些模块
            -   menu 菜单
            -   tray 托盘
    -   preload 预加载
-   public 静态资源
-   src 渲染进程(可换成对应的 react)
-   types
-   ...

## TODO

-   [x] 搭建目录结构
-   [x] eslist + prettire
-   [x] commit 校验
-   [x] electron 目录打包优化
-   [ ] 更新处理
