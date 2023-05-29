<template>
    <div class="line-wrap">
        <h4>线条</h4>
        <ul class="line-inner">
            <li
                class="line-item"
                :class="{ active: curType === 'arrow' }"
                @click="handChange(IType.Arrow)"
                :title="curType"
            >
                <svg-icon name="arrow" size="48px" :color="curType === 'arrow' ? '#fff' : '#333'" />
            </li>

            <li
                class="line-item"
                :class="{ active: curType === 'smooth' }"
                @click="handChange(IType.Smooth)"
                :title="curType"
            >
                <svg-icon
                    name="smooth"
                    size="48px"
                    :color="curType === 'smooth' ? '#fff' : '#333'"
                />
            </li>

            <li
                class="line-item"
                :class="{ active: curType === 'zline' }"
                @click="handChange(IType.Zline)"
                :title="curType"
            >
                <svg-icon name="zline" size="48px" :color="curType === 'zline' ? '#fff' : '#333'" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" name="lineCom">
const enum IType {
    Arrow = 'arrow',
    Smooth = 'smooth',
    Zline = 'zline'
}
const emits = defineEmits(['change'])
const curType = ref<IType>(IType.Arrow)

const handChange = (type: IType) => {
    if (type === curType.value) return
    curType.value = type
    emits('change', type)
}
</script>

<style lang="scss" scoped>
.line-wrap {
    box-sizing: border-box;
    padding: 10px;
    h4 {
        text-align: center;
        margin: 10px 0;
    }

    .line-inner {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .line-item {
            border-radius: 8px;
            margin-right: 10px;
            cursor: pointer;
            &:last-child {
                margin-right: 0;
            }
        }
        .active {
            background-color: var(--el-color-primary);
        }
    }
}
</style>
