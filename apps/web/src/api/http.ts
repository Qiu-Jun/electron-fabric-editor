/*
 * @Author: June
 * @Description: axios 实例统一创建，收敛 token 注入逻辑
 * @Date: 2026-09-04 14:30:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 14:30:00
 * @FilePath: \element-fabric-editor\src\api\http.ts
 */
import axios from 'axios'
import type { AxiosInstance } from 'axios'

// 后端（Strapi 风格）统一响应结构
export interface IApiResponse<T = unknown> {
  data: T
  error?: { status: number; name: string; message: string }
  meta?: unknown
}

export interface IHttpOptions {
  // 每次请求时调用，保证读取最新登录态
  getToken?: () => string | null
  // token 前缀，如 'Bearer '
  tokenPrefix?: string
}

export function createHttp(
  baseURL: string,
  options: IHttpOptions = {}
): AxiosInstance {
  const instance = axios.create({ baseURL })
  instance.interceptors.request.use((config) => {
    const token = options.getToken?.()
    if (token) {
      config.headers.Authorization = `${options.tokenPrefix ?? ''}${token}`
    }
    return config
  })
  return instance
}
