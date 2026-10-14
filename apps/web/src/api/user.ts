/*
 * @Author: 秦少卫
 * @Date: 2024-04-24 14:07:06
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 14:30:00
 * @Description: 用户接口登录
 */

import { apiHost } from '@/constants/app'
import { createHttp } from './http'

const tokenKey = 'token'

const http = createHttp(apiHost, {
  getToken: () => localStorage.getItem(tokenKey),
  tokenPrefix: 'Bearer '
})

// 当前用户详情
export const getUserInfo = () => http.get('/api/users/me')

// 登录
export const login = (data: any) => http.post('/api/auth/local', data)

// 注册
export const register = (data: any) =>
  http.post('/api/auth/local/register', data)

// 登出
export const logout = () => localStorage.setItem(tokenKey, '')

// 自动登录
export const autoLogin = (data: any) =>
  http.post('/api/custom/autoAuthUser', data)

// 设置token
export const setToken = (token: string) => localStorage.setItem(tokenKey, token)

// 获取个人素材列表
export const getFileList = (params?: any) =>
  http.get('/api/user-materials?populate=*', { params })

// 上传素材
export const uploadImg = (data: any) => http.post('/api/upload', data)

// 创建素材
export const createdMaterial = (data: any) =>
  http.post('/api/user-materials', data)

// 删除素材
export const removeMaterial = (id: number | string) =>
  http.delete('/api/user-materials/' + id)

// 创建模板
export const createdTempl = (data: any) => http.post('/api/user-templs', data)

// 删除模板
export const removeTempl = (id: number | string) =>
  http.delete(`/api/user-templs/${id}`)

// 更新模板
export const updateTempl = (id: number | string, data: any) =>
  http.put(`/api/user-templs/${id}`, data)

// 查询模板列表
export const getTmplList = (query: string) =>
  http.get(`/api/user-templs?${query}`)

// 查询模板详情
export const getTmplInfo = (id: number | string) =>
  http.get(`/api/user-templs/${id}`)

// 获取用户树菜单
export const getUserFileTypeTree = () =>
  http.get(`/api/user-templ/getUerFileTypeTree`)

// 获取菜单树
export const getFileTypeTree = (params?: any) =>
  http.get(`/api/custom/getUerFileTypeTree`, { params })

// 获取用户文件树
export const getUerFileTree = () => http.get(`/api/user-templ/getUerFileTree`)
