<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-25 13:30:53
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 02:42:09
-->
<template>
    <div class="FlipClock">
        <Flipper ref="flipperHour1" />
        <Flipper ref="flipperHour2" />

        <Flipper ref="flipperMinute1" />
        <Flipper ref="flipperMinute2" />

        <Flipper ref="flipperSecond1" />
        <Flipper ref="flipperSecond2" />
    </div>
</template>

<script setup lang="ts">
import Flipper from './flipper.vue'
import dayjs from 'dayjs'

const flipperHour1 = ref(null)
const flipperHour2 = ref(null)
const flipperMinute1 = ref(null)
const flipperMinute2 = ref(null)
const flipperSecond1 = ref(null)
const flipperSecond2 = ref(null)

const state: any = reactive({
    timer: null,
    flipObjs: []
})
// 初始化
const init = () => {
    const nowTimeStr = dayjs(Date.now()).format('HHmmss')
    for (let i = 0; i < state.flipObjs.length; i++) {
        state.flipObjs[i]?.value?.setFront(nowTimeStr[i])
    }
}

const start = () => {
    state.timer = setInterval(() => {
        // 获取当前时间
        const nowTimeStr = dayjs(Date.now()).format('HHmmss')
        const nextTimeStr = dayjs(Date.now() + 1000).format('HHmmss')
        for (let i = 0; i < state.flipObjs.length; i++) {
            if (nowTimeStr[i] === nextTimeStr[i]) {
                continue
            }
            state.flipObjs[i]?.value?.flipDown(nowTimeStr[i], nextTimeStr[i])
        }
    }, 1000)
}

onMounted(() => {
    state.flipObjs = [
        flipperHour1,
        flipperHour2,
        flipperMinute1,
        flipperMinute2,
        flipperSecond1,
        flipperSecond2
    ]
    init()
    start()
})

onBeforeUnmount(() => {
    clearInterval(state.timer)
    state.timer = null
})
</script>
