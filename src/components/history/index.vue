<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-29 09:14:02
 * @LastEditors: June
 * @LastEditTime: 2023-05-29 09:35:31
-->
<template>
    <div>
        <el-button pain @click="onUnDo" :disabled="state.canUndo">undo</el-button>
        <el-button pain @click="onReDo" :disabled="state.canRedo">redo</el-button>
    </div>
</template>

<script setup lang="ts" name="history">
interface IState {
    canUndo: boolean
    canRedo: boolean
}

const state = reactive<IState>({
    canUndo: false,
    canRedo: false
})

const graph: any = inject('graph')

const onUnDo = () => graph.value.undo()

const onReDo = () => graph.value.redo()

onMounted(() => {
    nextTick(() => {
        graph.value.on('history:change', () => {
            state.canRedo = graph.value.canUndo()
            state.canUndo = graph.value.canRedo()
        })
    })
})
</script>
