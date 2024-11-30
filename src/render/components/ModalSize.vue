<template>
  <el-dialog v-model="show" destroy-on-close :title="props.title" footer-hide>
    <h3>
      {{ $t('editor.importFiles.createDesign.customSize') }}
    </h3>
    <section class="size-wrap">
      <div class="size-wrap-item">
        <span>{{ $t('editor.width') }}</span>
        <el-input-number
          style="width: 70%"
          v-model="width"
          :min="1"
          :placeholder="$t('common.placeholder.input')"
          controls-position="right"
        ></el-input-number>
      </div>
      <div class="size-wrap-item">
        <span>{{ $t('editor.height') }}</span>
        <el-input-number
          style="width: 70%"
          v-model="height"
          :min="1"
          :placeholder="$t('common.placeholder.input')"
          controls-position="right"
        ></el-input-number>
      </div>
      <div :label-width="0">
        <el-button type="primary" @click="customSizeCreate">
          {{ $t('common.okText') }}
        </el-button>
      </div>
    </section>
    <el-divider direction="horizontal" />
    <h3>
      {{ $t('editor.importFiles.createDesign.systemSize') }}
    </h3>
    <section class="cell-wrap box-border">
      <div
        :key="item.name"
        v-for="item in sizeList"
        class="cell-main"
        @click="setSize(`${item.width}x${item.height}x${item.unit}`)"
      >
        <div>
          <div class="cell-name">{{ item.name }}</div>
          <div class="cell-label">
            {{ `${item.width}x${item.height}${item.unit}` }}
          </div>
        </div>
        <el-icon><Plus /></el-icon>
      </div>
    </section>
  </el-dialog>
</template>

<script name="ImportJson" setup>
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useEditorStore } from '@/store/modules/editor'

const editorStore = useEditorStore()
const emit = defineEmits(['set'])

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
const show = ref(false)
const width = ref(null)
const height = ref(null)
const sizeList = ref([])
const showSetSize = (w, h) => {
  width.value = w || null
  height.value = h || null
  // 获取素材
  editorStore.editor.getSizeList().then((res) => {
    sizeList.value = res
  })
  show.value = true
}
const setSize = (itemString) => {
  const [w, h] = itemString.split('x')
  width.value = Number(w)
  height.value = Number(h)
}

const customSizeCreate = async () => {
  if (width.value && height.value) {
    emit('set', width.value, height.value)
    show.value = false
  } else {
    ElMessage.warning('请检查尺寸')
  }
}

defineExpose({
  showSetSize
})
</script>
<style scoped lang="scss">
.size-wrap {
  @apply f-center;
  .size-wrap-item {
    @apply inline-block mr-10px;
    & > span {
      @apply mr-10px;
    }
  }
}
.cell-wrap {
  .cell-main {
    vertical-align: middle;
    @apply flex justify-between items-center mb-10px;
    .cell-name {
      @apply leading-24px text-14px;
    }
    .cell-label {
      line-height: 1.2;
      color: #808695;
      @apply text-12px;
    }
  }
}
</style>
