<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 17:11:20
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 22:47:23
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
                @change="onGridType"
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
                @change="onThickNess"
            />
        </div>

        <div class="setting-item">
            <span>网格颜色</span>
            <div>
                <ColorPicker
                    :color="color"
                    :on-change="(color: any) => onChange(color, 'change')"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="graphSetting">
import ColorPicker from 'color-gradient-picker-vue3'
const gridOps = reactive({
    visible: true,
    type: 'mesh',
    args: {
        thickness: 1
    }
})
const gridSize = ref(10)

const graph: any = inject('graph')
const color = ref({
    red: 255,
    green: 0,
    blue: 0,
    alpha: 1
})
const onChange = (color, type) => {
    console.log(color, type)
}
// 显示/隐藏网格
const onGridShow = (val: boolean) => {
    if (val) {
        graph?.value?.showGrid()
    } else {
        graph?.value?.hideGrid()
    }
}

// 修改网格类型
const onGridType = () => {
    drawGrids()
}

// 修改网格的大小
const onGridSize = (val: number) => {
    graph?.value?.setGridSize(val)
}

// 修改网格线条粗细
const onThickNess = () => {
    drawGrids()
}

onMounted(() => {
    console.log('2')
    console.log(graph.value)
})

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
