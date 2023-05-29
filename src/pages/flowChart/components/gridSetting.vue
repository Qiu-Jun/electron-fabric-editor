<!--
 * @Descripttion: 画布设置
 * @version:
 * @Author: June
 * @Date: 2023-05-28 17:11:20
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 01:50:09
-->
<template>
    <div class="setting-wrap">
        <p class="title">画布背景设置</p>

        <div class="setting-item">
            <span>显示网格</span>
            <el-switch v-model="gridOps.visible" @change="onGridShow"></el-switch>
        </div>

        <div class="setting-item">
            <span>网格类型</span>
            <el-radio-group
                size="small"
                v-model="gridOps.type"
                :disabled="!gridOps.visible"
                @change="drawGrids"
            >
                <el-radio label="dot">点状网格</el-radio>
                <el-radio label="mesh">网状网格</el-radio>
            </el-radio-group>
        </div>

        <div class="setting-item">
            <span>网格大小</span>
            <el-slider
                :min="10"
                :max="20"
                v-model="gridSize"
                :disabled="!gridOps.visible"
                @change="onGridSize"
            />
        </div>

        <div class="setting-item">
            <span>网格粗细</span>
            <el-slider
                :min="1"
                :max="15"
                v-model="gridOps.args.thickness"
                :disabled="!gridOps.visible"
                @change="drawGrids"
            />
        </div>

        <div class="setting-item">
            <span>网格颜色</span>
            <el-color-picker v-model="gridOps.args.color" show-alpha @change="drawGrids" />
        </div>
    </div>
</template>

<script setup lang="ts" name="graphSetting">
// import ColorPicker from 'color-gradient-picker-vue3'

const gridOps = reactive({
    visible: true,
    type: 'mesh',
    args: {
        color: '#333',
        thickness: 1
    }
})
const gridSize = ref(10)

const flowProvide: any = inject('flowProvide')

// 显示/隐藏网格
const onGridShow = (val: boolean) => {
    if (val) {
        flowProvide.graph?.showGrid()
    } else {
        flowProvide.graph?.hideGrid()
    }
}

// 修改网格的大小
const onGridSize = (val: number) => {
    flowProvide.graph?.setGridSize(val)
}

interface DrawGridOptions {
    type: string
    args?: any
    [key: string]: any
}
function drawGrids() {
    try {
        // flowProvide.graph?.clearGrid()
        flowProvide.graph.drawGrid(gridOps)
    } catch (error) {
        console.log(error)
    }
}
</script>

<style lang="scss" scoped>
@import './setting.scss';
:deep(.el-radio) {
    margin-right: 10px;
}
</style>
