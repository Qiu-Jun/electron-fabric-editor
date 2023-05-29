<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 20:15:16
 * @LastEditors: June
 * @LastEditTime: 2023-05-29 08:55:36
-->
<template>
    <div class="node-wrap">
        <h4>节点</h4>
        <ul class="node-inner">
            <li class="node-item" @mousedown="onDrag('circle', $event)">
                <el-tooltip effect="dark" content="圆形节点" placement="bottom">
                    <svg-icon name="circle" size="48px" />
                </el-tooltip>
            </li>

            <li class="node-item" @mousedown="onDrag('rect', $event)">
                <el-tooltip effect="dark" content="正方形节点" placement="bottom">
                    <svg-icon name="rect" size="48px" />
                </el-tooltip>
            </li>

            <li class="node-item" @mousedown="onDrag('roteRect', $event)">
                <el-tooltip effect="dark" content="条件节点" placement="bottom">
                    <svg-icon name="rote-rect" size="48px" />
                </el-tooltip>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" name="nodesCom">
import drag2Graph from '@/utils/drag2Graph'

const graph: any = inject('graph')
const onDrag = (type: string, e: MouseEvent) => {
    drag2Graph(graph.value, type, e)
}
</script>

<style lang="scss" scoped>
.node-wrap {
    box-sizing: border-box;
    padding: 10px;
    h4 {
        text-align: center;
        margin: 10px 0;
    }

    .node-inner {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .node-item {
            margin-right: 10px;
            cursor: pointer;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
