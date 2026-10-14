/*
 * @Author: 秦少卫
 * @Date: 2024-06-09 13:04:51
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 14:30:00
 * @Description: 管理员API
 */

import { createHttp } from './http'

const tokenKey = 'AdminToken'

const http = createHttp(import.meta.env.APP_ADMINAPIHOST, {
  getToken: () => localStorage.getItem(tokenKey)
})

export function getToken() {
  const token = localStorage.getItem(tokenKey)
  return token
}

export function setToken(token: string) {
  localStorage.setItem(tokenKey, token)
}

// 新增模板
export const createdTempl = (data: any) =>
  http.post('/content-manager/collection-types/api::templ.templ', data)

// 更新模板
export const updateTempl = (id: string, data: any) =>
  http.put(`/content-manager/collection-types/api::templ.templ/${id}`, data)

// 上传图片
export const uploadImg = (data: any) => http.post('/upload', data)

// 删除图片
export const deleteImg = (id: string) => http.delete('/upload/files/' + id)

// 获取详情
export const getTempl = (id: string) =>
  http.get(`/content-manager/collection-types/api::templ.templ/${id}`)
