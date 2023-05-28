<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 15:03:06
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 22:17:53
-->
<template>
    <el-container>
        <el-header height="50px">
            <div class="header-content">
                <div class="hd-left">June Tool</div>
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

                <lineCom />
            </section>
            <div class="mind-content" ref="graph-container" id="graph-container">2</div>
            <section class="right-panel">
                <component :is="graphSetting" />
            </section>
        </el-main>
    </el-container>
</template>

<script setup lang="ts" name="mind">
import { Graph, Shape } from '@antv/x6'
import nodesCom from './components/nodesCom.vue'
import lineCom from './components/lineCom.vue'
import graphSetting from './components/graphSetting.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

const graph = ref<Graph | null>(null)
const initGraph = () => {
    graph.value = new Graph({
        container: document.getElementById('graph-container') || undefined,
        grid: {
            visible: true,
            size: 10,
            type: 'mesh',
            args: [
                {
                    color: '#ccc',
                    thickness: 1
                }
            ]
        },
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
                            stroke: '#A2B1C3',
                            strokeWidth: 2,
                            targetMarker: {
                                name: 'block',
                                width: 12,
                                height: 8
                            }
                        }
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
}

const handleDelete = () => {
    ElMessageBox.alert('您确定删除吗', '提示', {
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        callback: (action: Action) => {
            ElMessage({
                type: 'info',
                message: `action: ${action}`
            })
        }
    })
}

onMounted(() => {
    initGraph()
    console.log(graph.value)
})

provide('graph', graph)
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
        font-weight: bolder;
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
