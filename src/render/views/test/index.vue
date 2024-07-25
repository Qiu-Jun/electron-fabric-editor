<template>
  <div class="export">
    <Button @click="exportExcel">导出</Button>

    <Upload action="" :before-upload="handleUpload">
      <Button icon="ios-cloud-upload-outline">Upload files</Button>
    </Upload>
  </div>
</template>

<script setup lang="ts">
import { Excel, type mergeListType } from '@/lib/excel'
import { reactive } from 'vue'
const tableData = reactive([
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '张三', age: 18 },
  { id: 3, name: '王五', age: 24 },
  { id: 4, name: '赵六', age: 24 },
  { id: 5, name: '刘七', age: 24 }
])
const header = ['id', 'name', 'age']
const customHeader = ['id', '姓名', '年龄']
const mergeList: mergeListType[] = reactive([
  { startRow: 1, endRow: 2, startColumn: 3, endColumn: 3 },
  { startRow: 3, endRow: 5, startColumn: 3, endColumn: 3 }
])
const exportExcel = () => {
  const excel = new Excel()
  excel.exportExcel({
    name: '个人信息',
    title: '标题',
    data: tableData,
    header,
    customHeader,
    mergeList
  })
}

const handleUpload = async (file: any) => {
  // 表头字段数组
  const header = ['id', 'name', 'age']
  console.log(file)
  const excel = new Excel(file)
  // 导入文件获取数据
  const res = await excel.importExcel({ header })
  console.log(res)
  return false
}
</script>
