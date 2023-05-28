<template>
    <div class="line-wrap">
        <h4>线条</h4>
        <div>
            <el-tooltip effect="dark" content="直线" placement="bottom">
                <svg-icon name="arrow" size="48px" />
            </el-tooltip>

            <el-tooltip effect="dark" content="曲线" placement="bottom">
                <svg-icon name="roundline" size="48px" />
            </el-tooltip>

            <el-tooltip effect="dark" content="直角线" placement="bottom">
                <svg-icon name="zline" size="48px" />
            </el-tooltip>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.line-wrap {
    box-sizing: border-box;
    padding: 10px;
    h4 {
        text-align: center;
        margin: 10px 0;
    }
}
</style>
