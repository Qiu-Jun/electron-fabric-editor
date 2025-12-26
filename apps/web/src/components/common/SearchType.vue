<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 16:04:59
 * @LastEditors: June
 * @LastEditTime: 2024-09-20 10:44:04
 * @Description: 搜索组件
-->

<template>
  <div class="search-box">
    <el-button
      text
      class="back-btn"
      @click="clear"
      v-if="typeValue || searchKeyWord"
      :icon="ArrowLeftBold"
    ></el-button>

    <el-select
      class="select"
      v-model="typeValue"
      :disabled="loading"
      placeholder="请选择"
      @change="change"
    >
      <el-option
        v-for="item in typeList"
        :value="item.value"
        :label="item.label"
        :key="item.value"
      />
    </el-select>
    <el-input
      class="input"
      :placeholder="`在${typeText}中搜索`"
      v-model="searchKeyWord"
      :disabled="loading"
      clearable
      @change="inputChange"
      @search="change"
      search
    />
  </div>
</template>

<script name="ImportJson" setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  typeListApi: {
    type: Function,
    Object: () => ({})
  }
})
const emit = defineEmits(['change'])

const loading = ref(false)

const typeValue = ref('')
const searchKeyWord = ref('')
const typeList = ref([])
const typeText = computed(() => {
  const info = typeList.value.find((item) => item.value === typeValue.value)
  return info?.label || '全部'
})

onMounted(async () => {
  loading.value = true

  try {
    const res = await props.typeListApi()
    const list = res.data.data.map((item) => {
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
    console.log(error)
  }

  loading.value = false
})

const change = () => {
  emit('change', {
    searchKeyWord: searchKeyWord.value,
    typeValue: typeValue.value
  })
}

// const getValue = () => {
//   return { type: typeValue.value, searchKeyWord };
// };
const clear = () => {
  typeValue.value = ''
  searchKeyWord.value = ''
  change()
}

const setType = (type) => {
  typeValue.value = type
}

const inputChange = debounce(change, 300)

defineExpose({
  setType
})
</script>
<style scoped lang="scss">
.search-box {
  padding-top: 10px;
  display: flex;

  .back-btn {
    margin-right: 10px;
    padding: 0;
  }
  .input {
    margin-left: 10px;
  }
  .select {
    width: 120px;
  }
}
</style>
