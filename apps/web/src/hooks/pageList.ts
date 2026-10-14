/*
 * @Author: 秦少卫
 * @Date: 2024-05-17 11:00:14
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 15:00:00
 * @Description: 模板市场分页（分类+搜索），基于通用 usePageList 封装
 */

import axios from 'axios'
import qs from 'qs'
import { apiHost } from '@/constants/app'
import usePager, {
  getMaterialInfoUrl,
  getMaterialPreviewUrl
} from './usePageList'

const repoSrc = apiHost

// 分类API
const typeApi = (url: string) =>
  axios.get(`${repoSrc}/api/${url}?pagination[pageSize]=200`)

// 模板详情API
const getInfo = (id: string | number) =>
  axios.get(`${repoSrc}/api/templs/${id}`)

export default function usePageList({
  typeUrl,
  listUrl,
  searchTypeKey,
  searchWordKey,
  scrollElement,
  pageSize,
  fields = []
}: {
  typeUrl: string
  listUrl: string
  searchTypeKey: string
  searchWordKey: string
  scrollElement: string
  pageSize: number
  fields?: string[]
}) {
  // 分类
  const typeValue = ref<string | number>('')
  const typeList = ref<{ label: string; value: string | number }[]>([])
  const typeText = computed(() => {
    const info = typeList.value.find((item) => item.value === typeValue.value)
    return info?.label || '全部'
  })
  // 关键词
  const searchKeyWord = ref('')

  // 分类+搜索过滤参数，随输入联动
  const searchQS = computed(() => {
    const filters: Record<string, any> = {}
    if (typeValue.value) {
      filters[searchTypeKey] = { $eq: typeValue.value }
    }
    if (searchKeyWord.value) {
      filters[searchWordKey] = { $contains: searchKeyWord.value }
    }
    return qs.stringify({ filters })
  })

  // 通用分页：数据获取与滚动状态
  const pager = usePager({
    el: scrollElement,
    pageSize,
    fields,
    apiClient: (query: string) =>
      axios.get(`${repoSrc}/api/${listUrl}?${query}&${searchQS.value}`),
    formatData: (data: any[]) =>
      data.map((item) => ({
        id: item.id,
        name: item.attributes.name,
        desc: item.attributes.desc,
        json: item.attributes?.json,
        src: getMaterialInfoUrl(item.attributes.img),
        previewSrc: getMaterialPreviewUrl(item.attributes.img)
      }))
  })

  // 获取分类列表
  const getTypeList = async () => {
    try {
      const res = await typeApi(typeUrl)
      const list = res.data.data.map((item: any) => {
        return {
          value: item.id,
          label: item.attributes.name
        }
      })
      typeList.value = [
        {
          label: '全部',
          value: ''
        },
        ...list
      ]
    } catch (error) {
      typeList.value = []
    }
  }

  // 先拉分类再开始分页
  const startPage = async () => {
    await getTypeList()
    await pager.startPage()
  }

  return {
    startPage,
    searchKeyWord,
    typeValue,
    typeText,
    typeList,
    pageLoading: pager.pageLoading,
    pageData: pager.pageData,
    isDownBottom: pager.isDownBottom,
    startGetList: pager.startGetList,
    nextPage: pager.nextPage,
    scrollHeight: pager.scrollHeight,
    showScroll: pager.showScroll,
    getInfo
  }
}
