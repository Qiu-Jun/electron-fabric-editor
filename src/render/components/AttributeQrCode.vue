<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType && isQrcode">
    <!-- <h3>字体属性</h3> -->
    <el-divider content-position="left">
      <h4>{{ $t('editor.qrCode.name') }}</h4>
    </el-divider>
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.qrCode.content') }}</span>
          <div class="flex-1">
            <el-input v-model="baseAttr.data" @change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <div class="content number-content">
            <InputNumber
              v-model="baseAttr.width"
              @on-change="changeCommon"
              :append="$t('editor.width')"
              :min="1"
            ></InputNumber>
          </div>
        </div>
        <div class="flex-item" style="margin-left: 20px">
          <div class="content number-content">
            <InputNumber
              v-model="baseAttr.margin"
              @on-change="changeCommon"
              :append="$t('editor.qrCode.space')"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.qrCode.splashes') }}</span>
          <div class="content">
            <el-color-picker
              id="dotsColor"
              v-model="baseAttr.dotsColor"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">{{ $t('editor.type') }}</span>
          <div class="content">
            <el-select v-model="baseAttr.dotsType" @change="changeCommon" style="width: 90px">
              <el-option v-for="item in optionsList.DotsType" :value="item" :key="item">
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.qrCode.outAngle') }}</span>
          <div class="content">
            <el-color-picker
              id="cornersSquareColor"
              v-model="baseAttr.cornersSquareColor"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">{{ $t('editor.type') }}</span>
          <div class="content">
            <el-select
              v-model="baseAttr.cornersSquareType"
              @change="changeCommon"
              style="width: 90px"
            >
              <el-option v-for="item in optionsList.cornersDotType" :value="item" :key="item">
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.qrCode.inAngle') }}</span>
          <div class="content">
            <el-color-picker
              id="cornersDotColor"
              v-model="baseAttr.cornersDotColor"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">{{ $t('editor.type') }}</span>
          <div class="content">
            <el-select v-model="baseAttr.cornersDotType" @change="changeCommon" style="width: 90px">
              <el-option v-for="item in optionsList.cornersDotType" :value="item" :key="item">
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t('editor.qrCode.background') }}</span>
          <div class="content">
            <el-color-picker
              id="background"
              v-model="baseAttr.background"
              @change="changeCommon"
              show-alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">
            {{ $t('editor.qrCode.fault') }}
          </span>
          <div class="content">
            <el-select
              v-model="baseAttr.errorCorrectionLevel"
              @change="changeCommon"
              style="width: 90px"
            >
              <el-option
                v-for="item in optionsList.errorCorrectionLevelType"
                :value="item"
                :key="item"
              >
                {{ item }}
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const editorStore = useEditorStore()
const { isOne, isMatchType } = useSelect(['image'])
const update = getCurrentInstance()

// 文字元素
const extensionType = ref('')

const isQrcode = computed(() => extensionType.value === 'qrcode')

// 属性值
const baseAttr = reactive<Record<string, any>>({
  data: '',
  width: 300,
  margin: 10,
  errorCorrectionLevel: 'M',
  dotsColor: '#000000',
  dotsType: 'rounded',
  cornersSquareColor: '#000000',
  cornersSquareType: 'dot',
  cornersDotColor: '#000000',
  cornersDotType: 'square',
  background: '#ffffff'
})

// 属性获取
const getObjectAttr = (e: any) => {
  const activeObject: any = editorStore.canvas?.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  extensionType.value = activeObject?.extensionType || ''
  if (activeObject && isMatchType && activeObject?.extensionType === 'qrcode') {
    const extension = activeObject.get('extension')
    Object.keys(extension).forEach((key) => {
      baseAttr[key] = extension[key]
    })
  }
}

// 通用属性改变
const changeCommon = () => {
  editorStore.editor.setQrCode(toRaw(baseAttr))
  editorStore.canvas?.renderAll()
}

const selectCancel = () => {
  extensionType.value = ''
  update?.proxy?.$forceUpdate()
}

// 容错率

const optionsList = reactive({
  CornersType: [],
  DotsType: [],
  cornersDotType: [],
  errorCorrectionLevelType: []
})

onMounted(() => {
  nextTick(() => {
    const res = editorStore.editor?.getQrCodeTypes()
    res && Object.assign(optionsList, res)
    editorStore.editor?.on('selectCancel', selectCancel)
    editorStore.editor?.on('selectOne', getObjectAttr)
    editorStore.canvas?.on('object:modified', getObjectAttr)
  })
})

onBeforeUnmount(() => {
  editorStore.editor?.off('selectCancel', selectCancel)
  editorStore.editor?.off('selectOne', getObjectAttr)
  editorStore.canvas?.off('object:modified', getObjectAttr)
})
</script>

<style scoped lang="scss">
:deep(.el-color-picker__trigger) {
  width: 88px;
}
.number-content {
  @apply f-center;
}

.flex-view {
  background: #f6f7f9;
  @apply relative z-1 rounded-5px flex justify-between w-full mb-10px p-5px;
}
.flex-item {
  @apply flex-1 inline-flex box-border;
  .label {
    @apply w-32px h-32px leading-32px inline-block text-14px;
  }
  .content {
    flex: 1;
    // width: 60px;
  }
  .slider-box {
    width: calc(100% - 50px);
    @apply mb-10px;
  }
}
</style>
