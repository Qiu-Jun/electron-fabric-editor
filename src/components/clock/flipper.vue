<template>
    <div class="flipper-box" :class="[state.flipType, { go: state.isFlipping }]">
        <div class="digital front" :class="_textClass(state.frontTextFromData)"></div>
        <div class="digital back" :class="_textClass(state.backTextFromData)"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    // front paper text
    // 前牌文字
    frontText: {
        type: [Number, String],
        default: 0
    },
    // back paper text
    // 后牌文字
    backText: {
        type: [Number, String],
        default: 1
    },
    // flipping duration, please be consistent with the CSS animation-duration value.
    // 翻牌动画时间，与CSS中设置的animation-duration保持一致
    duration: {
        type: Number,
        default: 800
    }
})

const state = reactive({
    isFlipping: false,
    flipType: 'down',
    frontTextFromData: props.frontText || 0,
    backTextFromData: props.backText || 1
})

const _textClass = (number: string | number) => 'number' + number

const _flip = (type: string, front: string, back: string) => {
    // 如果处于翻转中，则不执行
    if (state.isFlipping) {
        return false
    }
    state.frontTextFromData = front
    state.backTextFromData = back
    // 根据传递过来的type设置翻转方向
    state.flipType = type
    // 设置翻转状态为true
    state.isFlipping = true
    let timer: any = null
    timer = setTimeout(() => {
        // 设置翻转状态为false
        state.isFlipping = false
        state.frontTextFromData = back
        clearTimeout(timer)
        timer = null
    }, props.duration)
}

// 下翻牌
const flipDown = (front: string, back: string) => {
    _flip('down', front, back)
}
// 上翻牌
const flipUp = (front: string, back: string) => {
    _flip('up', front, back)
}
// 设置前牌文字
const setFront = (text: string) => {
    state.frontTextFromData = text
}
// 设置后牌文字
const setBack = (text: string) => {
    state.backTextFromData = text
}

defineExpose({
    flipDown,
    flipUp,
    setFront,
    setBack
})
</script>

<style lang="scss" scoped>
.flipper-box {
    &:nth-of-type(1),
    &:nth-of-type(3),
    &:nth-of-type(5) {
        margin-right: 4px;
    }
    &:nth-of-type(2),
    &:nth-of-type(4) {
        margin-right: 10px;
    }
    display: inline-block;
    position: relative;
    width: 60px;
    height: 100px;
    line-height: 100px;
    border-radius: 10px;
    font-size: 66px;
    color: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: 'Helvetica Neue';
    .digital:before,
    .digital:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        background: #000;
        overflow: hidden;
        box-sizing: border-box;
    }
    .digital:before {
        top: 0;
        bottom: 50%;
        border-radius: 10px 10px 0 0;
        border-bottom: solid 1px #666;
    }
    .digital:after {
        top: 50%;
        bottom: 0;
        border-radius: 0 0 10px 10px;
        line-height: 0;
    }

    /*向下翻*/
    &.down {
        &.go {
            .front:before {
                transform-origin: 50% 100%;
                animation: frontFlipDown 0.6s ease-in-out both;
                box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
                backface-visibility: hidden;
            }
            .back:after {
                animation: backFlipDown 0.6s ease-in-out both;
            }
        }
        .front:before {
            z-index: 3;
        }
        .back:after {
            z-index: 2;
            transform-origin: 50% 0%;
            transform: perspective(160px) rotateX(180deg);
        }
        .front:after,
        .back:before {
            z-index: 1;
        }
    }

    /*向上翻*/
    &.up {
        &.go {
            .front:after {
                transform-origin: 50% 0;
                animation: frontFlipUp 0.6s ease-in-out both;
                box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3);
                backface-visibility: hidden;
            }
            .back:before {
                animation: backFlipUp 0.6s ease-in-out both;
            }
        }
        .front:after {
            z-index: 3;
        }
        .back:before {
            z-index: 2;
            transform-origin: 50% 100%;
            transform: perspective(160px) rotateX(-180deg);
        }
        .front:before,
        .back:after {
            z-index: 1;
        }
    }
    .number0:before,
    .number0:after {
        content: '0';
    }
    .number1:before,
    .number1:after {
        content: '1';
    }
    .number2:before,
    .number2:after {
        content: '2';
    }
    .number3:before,
    .number3:after {
        content: '3';
    }
    .number4:before,
    .number4:after {
        content: '4';
    }
    .number5:before,
    .number5:after {
        content: '5';
    }
    .number6:before,
    .number6:after {
        content: '6';
    }
    .number7:before,
    .number7:after {
        content: '7';
    }
    .number8:before,
    .number8:after {
        content: '8';
    }
    .number9:before,
    .number9:after {
        content: '9';
    }
}

@keyframes frontFlipDown {
    0% {
        transform: perspective(160px) rotateX(0deg);
    }
    100% {
        transform: perspective(160px) rotateX(-180deg);
    }
}
@keyframes backFlipDown {
    0% {
        transform: perspective(160px) rotateX(180deg);
    }
    100% {
        transform: perspective(160px) rotateX(0deg);
    }
}
@keyframes frontFlipUp {
    0% {
        transform: perspective(160px) rotateX(0deg);
    }
    100% {
        transform: perspective(160px) rotateX(180deg);
    }
}
@keyframes backFlipUp {
    0% {
        transform: perspective(160px) rotateX(-180deg);
    }
    100% {
        transform: perspective(160px) rotateX(0deg);
    }
}
</style>
