/*
 * @Author: June
 * @Description:
 * @Date: 2023-01-17 13:07:15
 * @LastEditors: June
 * @LastEditTime: 2023-01-20 11:56:55
 */
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
