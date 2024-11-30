<template>
  <div class="w-full">
    <template v-if="list.length">
      <div class="layer-box">
        <div
          v-for="item in list"
          @click="select(item.id)"
          :key="item.id"
          :class="isSelect(item) && 'active'"
        >
          <el-row class="ellipsis">
            <el-col :span="22">
              <el-tooltip
                :content="item.name || item.text || item.type"
                placement="left"
              >
                <div>
                  <SvgIcon
                    extClass="text-20px"
                    :class="isSelect(item) && 'active'"
                    color="#fff"
                    :icon="iconType(item.type)"
                  />
                  | {{ textType(item.type, item) }}
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="2">
              <el-button
                :icon="item.isLock ? Lock : Unlock"
                link
                @click="doLock(item)"
              ></el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 层级调整按钮 -->
      <div class="btn-box">
        <el-button-group v-show="isOne">
          <el-button @click="up">
            <SvgIcon extClass="text-20px" color="#fff" icon="layer-up" />
          </el-button>
          <el-button @click="down">
            <SvgIcon extClass="text-20px" color="#fff" icon="layer-down" />
          </el-button>
          <el-button @click="upTop">
            <SvgIcon extClass="text-20px" color="#fff" icon="layer-upTop" />
          </el-button>
          <el-button @click="downTop">
            <SvgIcon extClass="text-20px" color="#fff" icon="layer-downTop" />
          </el-button>
        </el-button-group>
      </div>
    </template>
    <template v-else>
      <p class="empty-text">暂无图层</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { fabric } from 'fabric'
import { Lock, Unlock } from '@element-plus/icons-vue'
import { uniqBy } from 'lodash-es'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne, mixinState } = useSelect()

const list: any = ref([])

// 是否选中元素
const isSelect = (item: any) => {
  return (
    item.id === mixinState.mSelectId || mixinState.mSelectIds.includes(item.id)
  )
}

// 图层类型图标
const _iconType: Record<string, string> = {
  group: 'layer-group',
  textbox: 'layer-textbox',
  'i-text': 'layer-iText',
  image: 'layer-image',
  rect: 'layer-rect',
  circle: 'layer-circle',
  triangle: 'layer-triangle',
  polygon: 'layer-polygon'
}
const iconType = (type: string) => {
  return _iconType[type] || 'layer-default'
}
const textType = (type: string, item: any) => {
  if (type.includes('text')) {
    return item.name || item.text
  }
  const typeText: Record<string, string> = {
    group: '组合',
    image: '图片',
    rect: '矩形',
    circle: '圆形',
    triangle: '三角形',
    polygon: '多边形',
    path: '路径'
  }
  return typeText[type] || '默认元素'
}
// 选中元素
const select = (id: string) => {
  const info = editorStore.canvas
    ?.getObjects()
    .find((item: any) => item.id === id) as fabric.Object
  editorStore.canvas?.discardActiveObject()
  editorStore.canvas?.setActiveObject(info)
  editorStore.canvas?.requestRenderAll()
}

const up = () => {
  editorStore.editor.up()
}
const upTop = () => {
  editorStore.editor.toFront()
}
const down = () => {
  editorStore.editor.down()
}
const downTop = () => {
  editorStore.editor.toBack()
}

const getList = () => {
  // 不改原数组 反转
  list.value = [
    ...(editorStore.canvas?.getObjects().filter((item: any) => {
      //@ts-ignore
      return !(item instanceof fabric.GuideLine || item.id === 'workspace')
    }) || [])
  ]
    .reverse()
    .map((item: any) => {
      const { type, id, name, text, selectable } = item
      return {
        type,
        id,
        name,
        text,
        isLock: !selectable
      }
    })
  list.value = uniqBy(unref(list), 'id')
}

const doLock = (item: any) => {
  select(item.id)
  item.isLock ? editorStore.editor.unLock() : editorStore.editor.lock()
  editorStore.canvas?.discardActiveObject()
}

onMounted(() => {
  getList()
  editorStore.canvas?.on('after:render', getList)
})

onBeforeUnmount(() => {
  editorStore.canvas?.off('after:render', getList)
})
</script>

<style lang="scss" scoped>
:deep(.el-button-group) {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .el-button {
    flex: 1;
  }
}
.layer-box {
  height: calc(100vh - 170px);
  overflow-y: auto;
  margin-bottom: 5px;
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  & > div {
    padding: 0px 5px;
    margin: 3px 0;
    background: #f7f7f7;
    color: #c8c8c8;
    border-radius: 3px;
    font-size: 14px;
    line-height: 28px;
    &.active {
      color: #2d8cf0;
      background: #f0faff;
      font-weight: bold;
    }
  }
}
.btn-box {
  width: 100%;
  margin-bottom: 20px;
  background: #f3f3f3;
  :ddep(.el-button-group) {
    display: flex;
    .el-button {
      flex: 1;
    }
  }
}
svg {
  vertical-align: text-top;
}
.empty-text {
  width: 100%;
  text-align: center;
  padding-top: 10px;
  color: #999;
}
</style>

<style lang="scss">
span {
  svg {
    vertical-align: middle;
  }
  &.active {
    svg.icon {
      fill: #2d8cf0;
    }
  }
}
</style>
