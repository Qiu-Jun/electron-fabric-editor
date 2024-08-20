<!--
 * @Author: 秦少卫
 * @Date: 2024-05-21 09:53:33
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-21 15:36:36
 * @Description: file content
-->

<template>
  <div class="box attr-item-box" v-if="mixinState.mSelectMode === 'one'">
    <!-- <h3>数据</h3> -->
    <el-divider content-position="left"><h4>数据</h4></el-divider>

    <el-form :label-width="40" class="form-wrap">
      <el-form-item :label="$t('attributes.id')">
        <el-input
          v-model="baseAttr.id"
          @change="changeCommon('id', baseAttr.id)"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-select
          v-model="baseAttr.linkData[0]"
          filterable
          allow-create
          @on-change="changeCommon('linkData', baseAttr.linkData)"
        >
          <el-option value="src"></el-option>
          <el-option value="text"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-input v-model="baseAttr.linkData[1]" placeholder="请输入" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select'

const update = getCurrentInstance()
const { mixinState, canvasEditor } = useSelect()

// 属性值
const baseAttr = reactive({
  id: 0,
  linkData: ['', '']
})

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    baseAttr.id = activeObject.get('id')
    baseAttr.linkData = activeObject.get('linkData') || ['', '']
  }
}

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    activeObject && activeObject.set(key, value)
    canvasEditor.canvas.renderAll()
  }
}

const selectCancel = () => {
  update?.proxy?.$forceUpdate()
}

onMounted(() => {
  // 获取字体数据
  getObjectAttr()
  canvasEditor.on('selectCancel', selectCancel)
  canvasEditor.on('selectOne', getObjectAttr)
  canvasEditor.canvas.on('object:modified', getObjectAttr)
})

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel)
  canvasEditor.off('selectOne', getObjectAttr)
  canvasEditor.canvas.off('object:modified', getObjectAttr)
})
</script>

<style scoped lang="scss">
.box {
  margin-bottom: 10px;
}
</style>
