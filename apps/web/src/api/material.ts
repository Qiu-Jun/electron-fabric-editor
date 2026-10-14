/*
 * @Author: 秦少卫
 * @Date: 2024-04-24 14:07:06
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 14:30:00
 * @Description: 公共素材/字体/模板资源接口
 */

import { apiHost } from '@/constants/app'
import qs from 'qs'
import { createHttp } from './http'

const http = createHttp(apiHost)

// web详情
export const getWebInfo = () => http.get('/api/web-site?populate=*')

// 获取素材分类
export const getMaterialTypes = () => http.get('/api/material-types')

// 获取素材列表
export const getMaterials = (query: string) =>
  http.get('/api/materials?' + query)

// 获取根据分类获取素材
export const getMaterialsByType = (params: any) =>
  http.get('/api/materials?' + qs.stringify(params))

// 获取字体分类分类
export const getFontStyleTypes = () => http.get('/api/font-style-types')

// 获取字体素材列表
export const getFontStyles = (query: string) =>
  http.get('/api/font-styles?' + query)

// 获取根据分类获取字体样式列表
export const getFontStyleListByType = (params: any) =>
  http.get('/api/font-styles?' + qs.stringify(params))

// 获取字体分类分类
export const getTmplTypes = () => http.get('/api/templ-types')

// 获取模板列表
export const getTmplList = (query: string) => http.get('/api/templs?' + query)

// 获取banner
export const getBannerList = (query: string) =>
  http.get('/api/banners?' + query)
