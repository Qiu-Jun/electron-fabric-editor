<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 15:03:06
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 01:48:21
-->
<template>
    <el-container>
        <el-header height="50px">
            <div class="header-content">
                <div class="hd-left">
                    <div class="title">June Tool</div>
                    <div class="menu">
                        <history />
                    </div>
                </div>
                <div class="hd-right">
                    <el-button plain type="primary" v-debounce:300="handleDelete">
                        <svg-icon name="delete" size="24px" color="#409eff" />
                        <span>删除</span>
                    </el-button>
                    <el-button type="primary">
                        <svg-icon name="save" size="24px" color="#fff" />
                        <span>保存</span>
                    </el-button>
                </div>
            </div>
        </el-header>
        <el-main>
            <section class="left-panel">
                <nodesCom />

                <lineCom @change="onChangeLineType" />
            </section>
            <div class="mind-content" ref="graph-container" id="graph-container">2</div>
            <section class="right-panel">
                <component :is="COMMAP[state.selectType]" />
            </section>
        </el-main>
    </el-container>
</template>

<script setup lang="ts" name="mind">
import { Graph, Shape } from '@antv/x6'
import { History } from '@antv/x6-plugin-history'
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import gridSetting from './components/gridSetting.vue'
import nodeSetting from './components/nodeSetting.vue'
import edgeSetting from './components/edgeSetting.vue'
import nodesCom from './components/nodesCom.vue'
import lineCom from './components/lineCom.vue'
import history from '@/components/history/index.vue'

const enum ISelectType {
    Grid = 'grid',
    Node = 'node',
    Edge = 'edge'
}

const COMMAP = {
    grid: gridSetting,
    node: nodeSetting,
    edge: edgeSetting
}

const flowProvide = reactive<any>({
    graph: null
})

const state = reactive({
    selectType: ISelectType.Grid,
    connectEdgeType: {
        //连线方式
        connector: 'normal',
        router: {
            name: ''
        }
    }
})

const initGraph = () => {
    flowProvide.graph = new Graph({
        container: document.getElementById('graph-container') || undefined,
        // 网格
        grid: {
            visible: true,
            size: 10,
            type: 'mesh',
            args: [
                {
                    color: '#333',
                    thickness: 1
                }
            ]
        },
        // 滚轮控制
        mousewheel: {
            enabled: true,
            zoomAtMousePosition: true,
            modifiers: 'ctrl',
            minScale: 0.5,
            maxScale: 3
        },
        connecting: {
            router: 'manhattan',
            connector: {
                name: 'rounded',
                args: {
                    radius: 8
                }
            },
            anchor: 'center',
            connectionPoint: 'anchor',
            allowBlank: false,
            snap: {
                radius: 20
            },
            createEdge() {
                return new Shape.Edge({
                    attrs: {
                        line: {
                            stroke: '#333',
                            strokeWidth: 2,
                            targetMarker: {
                                name: 'block',
                                width: 12,
                                height: 8
                            }
                        }
                    },
                    connector: state.connectEdgeType.connector,
                    router: {
                        name: state.connectEdgeType.router.name || ''
                    },
                    zIndex: 0
                })
            },
            validateConnection({ targetMagnet }) {
                return !!targetMagnet
            }
        },
        highlighting: {
            magnetAdsorbed: {
                name: 'stroke',
                args: {
                    attrs: {
                        fill: '#5F95FF',
                        stroke: '#5F95FF'
                    }
                }
            }
        }
    })
    flowProvide.graph.use(
        new History({
            enabled: true
        })
    )
    flowProvide.graph.on('blank:click', () => {
        state.selectType = ISelectType.Grid
    })
    flowProvide.graph.on('cell:click', ({ cell }: any) => {
        state.selectType = cell.isNode() ? ISelectType.Node : ISelectType.Edge
    })
    flowProvide.graph.on('cell:click', ({ cell }: any) => {
        console.log(cell)
        // this.type = cell.isNode() ? 'node' : 'edge'
    })
    flowProvide.graph.on('cell:dblclick', ({ cell, x, y }: { cell: any; x: number; y: number }) => {
        console.log(cell, x, y)
        // this.type = cell.isNode() ? 'node' : 'edge'
    })
}

const handleDelete = () => {
    ElMessageBox.alert('您确定删除吗', '提示', {
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        callback: () => {
            if (flowProvide.graph) {
                const cells = flowProvide.graph.getCells() || null
                flowProvide.graph.removeCells(cells)
            }
        }
    })
}
//注释
// 改变线条类型
const onChangeLineType = (type: string) => {
    console.log(type)
    if (type === 'arrow') {
        state.connectEdgeType = {
            connector: 'normal',
            router: { name: '' }
        }
    } else if (type === 'smooth') {
        state.connectEdgeType = {
            connector: 'smooth',
            router: { name: '' }
        }
    } else {
        state.connectEdgeType = {
            connector: 'normal',
            router: { name: 'manhattan' }
        }
    }
}

onMounted(() => {
    initGraph()
})

provide('flowProvide', flowProvide)
</script>

<style lang="scss" scoped>
:deep(.el-header) {
    padding: 0;
}
:deep(.el-main) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: 960px;
    height: calc(100vh - 50px);
    padding: 0;
    background-color: #fff;
    overflow: hidden;
}
.header-content {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    .hd-left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .title {
            font-weight: bolder;
            margin-right: 10px;
        }
    }
}
.left-panel {
    flex: 0 0 240px;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #ccc;
}
.mind-content {
    flex: 1;
    height: 100%;
}
.right-panel {
    flex: 0 0 280px;
    height: 100%;
    border-left: 1px solid #ccc;
}
</style>
