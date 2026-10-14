/*
 * @Author: June
 * @Description: PSD 转 fabric JSON 工具类型声明（实现在 psd.js）
 * @Date: 2026-09-04 10:00:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 10:00:00
 * @FilePath: /element-fabric-editor/src/lib/core/utils/psd.d.ts
 */
import type Psd from '@webtoon/psd'

declare function psdToJson(psdFile: Psd): Promise<string>

export default psdToJson
