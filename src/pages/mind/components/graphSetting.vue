<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 17:11:20
 * @LastEditors: June
 * @LastEditTime: 2023-05-29 10:14:54
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

const graph: any = inject('graph')

// 显示/隐藏网格
const onGridShow = (val: boolean) => {
    console.log(graph)
    if (val) {
        graph?.value?.showGrid()
    } else {
        graph?.value?.hideGrid()
    }
}

// 修改网格的大小
const onGridSize = (val: number) => {
    graph?.value?.setGridSize(val)
}

interface DrawGridOptions {
    type: string
    args?: any
    [key: string]: any
}
function drawGrids() {
    try {
        console.log(gridOps)
        // graph?.value?.clearGrid()
        graph?.value?.drawGrid(gridOps)
    } catch (error) {
        console.log(error)
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-radio) {
    margin-right: 10px;
}
.setting-wrap {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    .title {
        font-size: 18px;
        font-weight: blod;
        border-bottom: 1px solid #ccc;
    }

    .setting-item {
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 60px;
        padding: 10px 16px 10px 10px;
        span {
            display: inline-block;
            width: 80px;
            font-size: 12px;
            text-align: left;
            margin-right: 10px;
        }
    }
}
</style>
