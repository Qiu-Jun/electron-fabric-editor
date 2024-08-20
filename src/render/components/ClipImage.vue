<template>
  <div v-if="mixinState.mSelectMode === 'one' && type === 'image'" class="attr-item-box">
    <div class="bg-item" style="margin-bottom: 10px">
      <el-dropdown style="width: 270px" @command="addClipPath">
        <el-button text>{{ $t('createClip') }}</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="bg-item">
      <el-button @click="removeClip" text>{{ $t('removeClip') }}</el-button>
    </div>
  </div>
</template>

<script setup name="ReplaceImg">
import useSelect from '@/hooks/select'
import { useI18n } from 'vue-i18n'

const update = getCurrentInstance()
// const canvasEditor = inject('canvasEditor');
const { mixinState, canvasEditor } = useSelect()
const { t } = useI18n()
const type = ref('')
const options = [
  {
    label: t('polygonClip'),
    value: 'polygon'
  },
  {
    label: t('rectClip'),
    value: 'rect'
  },
  {
    label: t('circleClip'),
    value: 'circle'
  },
  {
    label: t('triangleClip'),
    value: 'triangle'
  },
  {
    label: t('polygonClipInverted'),
    value: 'polygon-inverted'
  },
  {
    label: t('rectClipInverted'),
    value: 'rect-inverted'
  },
  {
    label: t('circleClipInverted'),
    value: 'circle-inverted'
  },
  {
    label: t('triangleClipInverted'),
    value: 'triangle-inverted'
  }
]
const addClipPath = async (name) => {
  canvasEditor.addClipPathToImage(name)
}
const removeClip = () => {
  canvasEditor.removeClip()
}
const init = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    type.value = activeObject.type
    update?.proxy?.$forceUpdate()
  }
}

onMounted(() => {
  canvasEditor.on('selectOne', init)
})

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', init)
})
</script>
<style lang="scss" scoped>
:deep(.el-button) {
  width: 100%;
}
.attr-item-box {
  margin-top: 8px;
}
</style>
