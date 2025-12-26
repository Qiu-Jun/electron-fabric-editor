<template>
  <div class="box mb-20px" v-if="isOne && isImage">
    <el-divider content-position="left">
      <h4>{{ $t('editor.imageSetting.stroke.title') }}</h4>
    </el-divider>
    <div class="hd-wrap">
      <div class="hd flex-1">
        <span>{{ $t('editor.imageSetting.stroke.enable') }}</span>
        <el-popover trigger="hover" content="只支持png透明图像">
          <template #reference>
            <el-icon color="#f34250"><WarningFilled /></el-icon>
          </template>
        </el-popover>
      </div>

      <el-switch
        v-model="openImgStroke"
        size="large"
        inline-prompt
        class="switch"
        :active-text="$t('common.enable')"
        :inactive-text="$t('common.close')"
        @change="onSwitchChange"
      />
    </div>

    <template v-if="openImgStroke">
      <div class="hd-wrap">
        <div class="hd">
          <span>{{ $t('editor.imageSetting.stroke.show') }}</span>
        </div>

        <el-switch
          inline-prompt
          v-model="isOnlyStroke"
          size="large"
          class="switch"
          :active-text="$t('common.yes')"
          :inactive-text="$t('common.no')"
          @change="updateStroke"
        />
      </div>
      <div class="operation">
        <div class="hd" style="flex-basis: 98px">
          <span>{{ $t('editor.imageSetting.stroke.size') }}</span>
        </div>
        <div style="width: 100%">
          <el-slider v-model="strokeWidth" :max="50" @change="onSliderChange" />
        </div>
      </div>

      <div class="operation" style="justify-content: space-between">
        <div class="hd">
          <span>{{ $t('editor.imageSetting.stroke.color') }}</span>
        </div>

        <div>
          <el-color-picker
            v-model="strokeColor"
            @change="onColorChange"
            placement="left"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script name="ImgStroke" lang="ts" setup>
import { WarningFilled } from '@element-plus/icons-vue'
import { fabric } from 'fabric'
import { Utils } from '@/lib/core'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
interface IExtendImage {
  [x: string]: any
  originWidth?: number
  originHeight?: number
  originSrc?: string
}

const { isOne } = useSelect()
const isImage = ref(false)
const openImgStroke = ref(false)
const strokeWidth = ref(5)
const strokeColor = ref('#000')
const isOnlyStroke = ref(false)
const getActiveObject = (): (fabric.Image & IExtendImage) | undefined => {
  const activeObject = editorStore.canvas?.getActiveObject()
  if (!activeObject || !Utils.isImage(activeObject)) return
  return activeObject
}

const setOrigin = () => {
  const _activeObject = getActiveObject()
  if (!_activeObject) return
  _activeObject.set('originWidth', _activeObject?.get('width'))
  _activeObject.set('originHeight', _activeObject?.get('height'))
  _activeObject.set('originSrc', _activeObject?.getSrc())
}

const updateStroke = () => {
  const strokeType = unref(isOnlyStroke) ? 'destination-out' : 'source-over'
  editorStore.editor.imageStrokeDraw(
    unref(strokeColor),
    unref(strokeWidth),
    strokeType
  )
}

const closeImgStroke = () => {
  strokeWidth.value = 0
  updateStroke()
}

const onSwitchChange = async (val: any) => {
  if (val) {
    unref(strokeWidth) === 0 && (strokeWidth.value = 5)
    setOrigin()
    updateStroke()
  } else {
    closeImgStroke()
  }
}

const onSliderChange = (val: any) => {
  if (!val) return
  strokeWidth.value = val
  updateStroke()
}

const onColorChange = (val: string | null) => {
  if (!val) return
  strokeColor.value = val
  updateStroke()
}

const handleSelectOne = () => {
  isImage.value = !!getActiveObject()
}

onMounted(() => {
  nextTick(() => {
    editorStore.editor?.on('selectOne', handleSelectOne)
  })
})

onBeforeUnmount(() => {
  editorStore.editor.off('selectOne', handleSelectOne)
})
</script>

<style lang="scss" scoped>
.box {
  .hd-wrap {
    @apply flex justify-between mb-10px;
    .hd {
      & > span {
        margin-right: 5px;
      }
    }
  }
  .operation {
    @apply flex justify-between items-center;
  }
}
</style>
