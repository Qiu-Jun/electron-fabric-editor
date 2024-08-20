<!--
 * @Author: 秦少卫
 * @Date: 2023-04-06 23:04:38
 * @LastEditors: June
 * @LastEditTime: 2024-07-25 10:54:54
 * @Description: 图片滤镜
-->

<template>
  <div v-if="mixinState.mSelectMode === 'one' && state.type === 'image'" class="box">
    <el-divider content-position="left">
      <h4>图片滤镜</h4>
    </el-divider>
    <el-collapse>
      <el-collapse-item name="1">
        <template #title>
          {{ $t('filters.simple') }}
        </template>

        <div class="filter-box">
          <!-- 无参数滤镜 -->
          <div class="filter-item" v-for="(value, key) in state.noParamsFilters" :key="key">
            <img :src="getImageUrl(key)" @click="changeFilters(key, !noParamsFilters[key])" />
            <el-checkbox
              v-model="state.noParamsFilters[key]"
              @change="(val) => changeFilters(key, val)"
            >
              {{ $t('filters.' + key) }}
            </el-checkbox>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" :title="$t('filters.complex')">
        <!-- 有参数滤镜与组合参数滤镜 -->
        <div>
          <div
            class="filter-item has-params"
            v-for="item in [...state.paramsFilters, ...state.combinationFilters]"
            :key="item.type"
          >
            <el-checkbox v-model="item.status" @change="changeFiltersByParams(item.type)">
              {{ $t('filters.' + item.type) }}
            </el-checkbox>
            <div v-if="item.status" class="content">
              <div class="content slider-box" v-for="info in item.params" :key="info">
                <div v-if="info.uiType === uiType.SELECT">
                  <el-radio-group v-model="info.value" @change="changeFiltersByParams(item.type)">
                    <el-radio :value="listItem" v-for="listItem in info.list" :key="listItem">
                      {{ $t('filters.' + item.type + 'List.' + listItem) }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <div v-if="info.uiType === uiType.NUMBER">
                  <el-slider
                    v-model="info.value"
                    :max="info.max"
                    :min="info.min"
                    :step="info.step"
                    @on-input="changeFiltersByParams(item.type)"
                  ></el-slider>
                </div>
                <div v-if="info.uiType === uiType.COLOR">
                  <el-color-picker
                    v-model="info.value"
                    show-alpha
                    size="small"
                    @change="changeFiltersByParams(item.type)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script name="Filter" setup>
import useSelect from '@/hooks/select'
import { uiType, paramsFilters, combinationFilters } from '../constants/filter'

const { fabric, mixinState, canvasEditor } = useSelect()
const update = getCurrentInstance()
// 无参数滤镜
const noParamsFilters = {
  BlackWhite: false,
  Brownie: false,
  Vintage: false,
  Kodachrome: false,
  technicolor: false,
  Polaroid: false,
  Invert: false,
  Sepia: false
}

const state = reactive({
  uiType,
  noParamsFilters,
  paramsFilters: [...paramsFilters],
  combinationFilters: [...combinationFilters],
  type: ''
})

// 无参数滤镜修改状态
const changeFilters = (type, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  state.noParamsFilters[type] = value
  if (value) {
    const itemFilter = _getFilter(activeObject, type)
    if (!itemFilter) {
      _createFilter(activeObject, type)
    }
  } else {
    _removeFilter(activeObject, type)
  }
}
// 有参数与组合滤镜修改
const changeFiltersByParams = (type) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  const filtersAll = [...state.paramsFilters, ...state.combinationFilters]
  const moduleInfo = filtersAll.find((item) => item.type === type)
  if (moduleInfo.status) {
    // 组合参数滤镜修改
    if (moduleInfo.handler) {
      _changeAttrByHandler(moduleInfo)
    } else {
      // 有参数滤镜修改
      moduleInfo.params.forEach((paramsItem) => {
        _changeAttr(type, paramsItem.key, paramsItem.value)
      })
    }
  } else {
    _removeFilter(activeObject, type)
  }
}

const handleSelectOne = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    state.type = activeObject.type
    if (state.type === 'image') {
      // 无参数滤镜回显
      Object.keys(noParamsFilters).forEach((type) => {
        state.noParamsFilters[type] = !!_getFilter(activeObject, type)
        update?.proxy?.$forceUpdate()
      })
      // 有参数滤镜回显
      paramsFilters.forEach((filterItem) => {
        const moduleInfo = state.paramsFilters.find((item) => item.type === filterItem.type)
        const filterInfo = _getFilter(activeObject, filterItem.type)
        moduleInfo.status = !!filterInfo
        moduleInfo.params.forEach((paramsItem) => {
          paramsItem.value = filterInfo ? filterInfo[paramsItem.key] : paramsItem.value
        })
      })

      // 组合滤镜回显
      combinationFilters.forEach((filterItem) => {
        const moduleInfo = state.combinationFilters.find((item) => item.type === filterItem.type)
        const filterInfo = _getFilter(activeObject, filterItem.type)
        moduleInfo.status = !!filterInfo
        // 不回显具体参数
      })
    }
    update?.proxy?.$forceUpdate()
  }
}

onMounted(() => {
  canvasEditor.on('selectOne', handleSelectOne)
})

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', handleSelectOne)
})

// 图片地址拼接
function getImageUrl(name) {
  return new URL(`../assets/filters/${name}.png`, import.meta.url).href
}

// 设置滤镜值
function _changeAttr(type, key, value) {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  const itemFilter = _getFilter(activeObject, type)
  if (itemFilter) {
    itemFilter[key] = value
  } else {
    const imgFilter = _createFilter(activeObject, type)
    imgFilter[key] = value
  }
  activeObject.applyFilters()
  canvasEditor.canvas.renderAll()
}

function _changeAttrByHandler(moduleInfo) {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  // 删除
  _removeFilter(activeObject, moduleInfo.type)
  // 创建
  const params = moduleInfo.params.map((item) => item.value)
  _createFilter(activeObject, moduleInfo.type, moduleInfo.handler(...params))
}

/**
 * Create filter instance
 * @param {fabric.Image} sourceImg - Source image to apply filter
 * @param {string} type - Filter type
 * @param {Object} [options] - Options of filter
 * @returns {Object} Fabric object of filter
 * @private
 */
function _createFilter(sourceImg, type, options = null) {
  let filterObj
  // capitalize first letter for matching with fabric image filter name
  const fabricType = _getFabricFilterType(type)
  const ImageFilter = fabric.Image.filters[fabricType]
  if (ImageFilter) {
    filterObj = new ImageFilter(options)
    filterObj.options = options
    sourceImg.filters.push(filterObj)
  }
  sourceImg.applyFilters()
  canvasEditor.canvas.renderAll()
  return filterObj
}
/**
 * Get applied filter instance
 * @param {fabric.Image} sourceImg - Source image to apply filter
 * @param {string} type - Filter type
 * @returns {Object} Fabric object of filter
 * @private
 */
function _getFilter(sourceImg, type) {
  let imgFilter = null

  if (sourceImg) {
    const fabricType = _getFabricFilterType(type)
    const { length } = sourceImg.filters
    let item, i

    for (i = 0; i < length; i += 1) {
      item = sourceImg.filters[i]
      if (item.type === fabricType) {
        imgFilter = item
        break
      }
    }
  }

  return imgFilter
}
/**
 * Remove applied filter instance
 * @param {fabric.Image} sourceImg - Source image to apply filter
 * @param {string} type - Filter type
 * @private
 */
function _removeFilter(sourceImg, type) {
  const fabricType = _getFabricFilterType(type)
  sourceImg.filters = sourceImg.filters.filter((value) => value.type !== fabricType)
  sourceImg.applyFilters()
  canvasEditor.canvas.renderAll()
}
/**
 * Change filter class name to fabric's, especially capitalizing first letter
 * @param {string} type - Filter type
 * @example
 * 'grayscale' -> 'Grayscale'
 * @returns {string} Fabric filter class name
 */
function _getFabricFilterType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<style scoped lang="scss">
:deep(.el-collapse) {
  border-top: none;
  border-bottom: none;
}
:deep(.el-collapse-item__header) {
  padding-left: 10px;
  background: #f6f7f9;
  position: relative;
  z-index: 1;
}
:deep(.el-collapse-item) {
  &:first-child {
    margin-top: 26px;
  }
  &:last-child {
    margin-bottom: 26px;
  }
}
.filter-box {
  overflow: hidden;
  .filter-item {
    float: left;
    cursor: pointer;
    width: 50%;
    margin-bottom: 10px;
    img {
      width: 90%;
      height: auto;
    }
  }
}
.has-params {
  display: inline-block;
  margin-bottom: 10px;
  width: 50%;
  cursor: none;
  .content {
    width: 90%;
  }
}
.box {
  margin-bottom: 12px;
}
</style>
