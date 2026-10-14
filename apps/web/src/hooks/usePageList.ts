/*
 * @Author: June
 * @Description: 通用分页/滚动加载 hook（新增文件需按规范加文件头注释）
 * @Date: 2026-09-04 15:00:00
 * @LastEditors: June
 * @LastEditTime: 2026-09-04 15:00:00
 * @FilePath: \element-fabric-editor\src\hooks\usePageList.ts
 */
import qs from 'qs'
import { apiHost } from '@/constants/app'

const APIHOST = apiHost

interface IPagerOptions {
  // 滚动容器选择器
  el: string
  // 请求函数，入参为序列化后的查询串
  apiClient: (query: string) => Promise<any>
  filters?: Record<string, any>
  sort?: any[]
  formatData?: (data: any[]) => any[]
  fields?: string[]
  pageSize?: number
}

export default function usePageList({
  el,
  apiClient,
  filters = {},
  sort = [],
  formatData,
  fields = [],
  pageSize = 20
}: IPagerOptions) {
  //  滚动条根据页面适应
  const showScroll = ref(false)
  const scrollHeight = ref(0)
  const startPage = async () => {
    // 滚动
    const myTemplBox = document.querySelector(el) as HTMLElement | null
    scrollHeight.value = myTemplBox?.offsetHeight || 0
    showScroll.value = true

    await startGetList()
  }

  // 素材列表
  const pageData = ref([]) as any
  const page = ref(1)
  const pagination = reactive({
    page: 0,
    pageCount: 0,
    pageSize,
    total: 0
  })

  // 是否到达底部
  const isDownBottom = computed(() => {
    return (
      pagination.page === page.value && pagination.page >= pagination.pageCount
    )
  })

  const pageLoading = ref(false)
  const getPageData = async () => {
    pageLoading.value = true
    try {
      const query = {
        populate: {
          img: '*'
        },
        filters: {},
        sort: sort,
        fields,
        pagination: {
          page: page.value,
          pageSize: pagination.pageSize
        }
      }
      const params = addFilterParams(query, filters)
      const res = await apiClient(qs.stringify(params))
      const list = formatData ? formatData(res.data.data) : res.data.data
      Object.keys(res.data.meta.pagination).forEach((key) => {
        ;(pagination as any)[key] = res.data.meta.pagination[key]
      })
      pageData.value = [...pageData.value, ...list]
    } catch (error) {
      // 错误已忽略，不影响主流程
    }
    pageLoading.value = false
  }

  const startGetList = () => {
    pageData.value = []
    page.value = 1
    getPageData()
  }

  const nextPage = () => {
    if (page.value >= pagination.pageCount) return
    page.value++
    setTimeout(() => {
      getPageData()
    }, 1000)
  }

  const addFilterParams = (query: any, filterConf: Record<string, any>) => {
    Object.keys(filterConf).forEach((key) => {
      const itemFilter: Record<string, any> = {}
      Object.keys(filterConf[key]).forEach((myKey) => {
        const skip = ['$eq', '$contains']
        const isNone = !filterConf[key][myKey]
        const isSkip = skip.includes(myKey) && isNone
        // 不包含跳过条件
        if (!isSkip) {
          itemFilter[myKey] = filterConf[key][myKey]
        } else {
          // 跳过条件下 判断是否过滤 默认过滤
          const isFilterEmpty = filterConf[key].filterEmpty
          if (!isFilterEmpty) {
            itemFilter[myKey] = filterConf[key][myKey]
          }
        }
      })
      query.filters[key] = itemFilter
    })
    return query
  }

  return {
    pageData, // 分页数据
    showScroll,
    scrollHeight,
    pageLoading,
    isDownBottom, // 是否到达底部
    startPage, // 开始分页
    getPageData, // 获取分页数据
    startGetList, // 从第一个开始
    nextPage // 下一页
  }
}

// Strapi 图片字段的原图地址
const getMaterialInfoUrl = (info: any) => {
  const imgUrl = info?.data?.attributes?.url || ''
  return APIHOST + imgUrl
}

// Strapi 图片字段的缩略图地址
const getMaterialPreviewUrl = (info: any) => {
  const imgUrl =
    info?.data?.attributes?.formats?.small?.url ||
    info?.data?.attributes?.url ||
    ''
  return APIHOST + imgUrl
}

export { getMaterialInfoUrl, getMaterialPreviewUrl }
