<template>
  <div class="attr-item-box" v-if="isOne && !isGroup">
    <!-- <h3>边框</h3> -->
    <el-divider content-position="left">
      <h4>{{ $t('editor.attrSetting.border.title') }}</h4>
    </el-divider>
    <!-- 通用属性 -->
    <div>
      <el-row :gutter="12" style="margin-right: 10px">
        <el-col :span="12">
          <div class="number-warp">
            <span class="label" style="margin-right: 10px">{{
              $t('editor.attrSetting.color')
            }}</span>
            <div style="flex: 1">
              <el-color-picker
                v-model="baseAttr.stroke"
                @change="(value: any) => changeCommon('stroke', value)"
                show-alpha
              />
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <InputNumber
            v-model="baseAttr.strokeWidth"
            @on-change="(value) => changeCommon('strokeWidth', value)"
            :append="$t('editor.attrSetting.border.width')"
            :min="0"
          ></InputNumber>
        </el-col>
      </el-row>

      <div class="number-warp">
        <span
          style="
            flex: 0 0 48px;
            font-size: var(--el-form-label-font-size);
            color: var(--el-text-color-regular);
          "
          >{{ $t('editor.attrSetting.border.stroke') }}</span
        >
        <div class="content">
          <el-select v-model="baseAttr.strokeDashArray" @change="borderSet">
            <el-option
              v-for="item in strokeDashList"
              :value="item.label"
              :label="item.label"
              :key="`stroke-${item.label}`"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputNumber from './InputNumber'
import { useEditorStore } from '@/store/modules/editor'
import useSelect from '@/hooks/select'

const { isOne, isGroup } = useSelect()
const editorStore = useEditorStore()
const update = getCurrentInstance()

const groupType = ['group']
// 属性值
const baseAttr: any = reactive({
  stroke: '#fff',
  strokeWidth: 0,
  strokeDashArray: []
})

const strokeDashList = [
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [],
      strokeLineCap: 'butt'
    },
    label: 'Stroke'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'butt'
    },
    label: 'Dash-1'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'round'
    },
    label: 'Dash-2'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'square'
    },
    label: 'Dash-3'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'round'
    },
    label: 'Dash-4'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'square'
    },
    label: 'Dash-5'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'round'
    },
    label: 'Dash-6'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'square'
    },
    label: 'Dash-7'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'round'
    },
    label: 'Dash-8'
  }
]

// 属性获取
const getObjectAttr = (e?: any) => {
  const activeObject = editorStore.canvas?.getActiveObject()

  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject && !groupType.includes(activeObject.type)) {
    baseAttr.stroke = activeObject.get('stroke')
    baseAttr.strokeWidth = activeObject.get('strokeWidth')
    const strokeDashArray = JSON.stringify(activeObject.get('strokeDashArray') || [])
    const target = strokeDashList.find((item) => {
      return (
        JSON.stringify(item.value.strokeDashArray) === strokeDashArray &&
        activeObject.get('strokeLineCap') === item.value.strokeLineCap
      )
    })
    if (target) {
      baseAttr.strokeDashArray = target.label
    }
  }
}

// 通用属性改变
const changeCommon = (key: string, value: any) => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    // @ts-ignore
    activeObject.set(key, value)
    activeObject.set('strokeUniform', true)
    editorStore.canvas?.renderAll()
  }
}

// 边框设置
const borderSet = (key: string) => {
  const activeObject = editorStore.canvas?.getActiveObjects()[0]
  if (activeObject) {
    const stroke = strokeDashList.find((item) => item.label === key)
    // @ts-ignore
    activeObject.set(stroke.value)
    editorStore.canvas?.renderAll()
  }
}

const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}

onMounted(() => {
  nextTick(() => {
    // 获取字体数据
    getObjectAttr()
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
  width: 64px;
}
:deep(.el-select__wrapper) {
  background: #f8f8f9;
  box-shadow: none;
}
.number-warp {
  background: #f6f7f9;
  padding: 0 15px 0 10px;
  @apply box-border w-full flex justify-start items-center rounded-5px mb-10px relative z-1;
  .label {
    flex: 0 0 32px;
    font-size: var(--el-form-label-font-size);
    color: var(--el-text-color-regular);
  }
  .content {
    @apply w-full;
  }
}
</style>
