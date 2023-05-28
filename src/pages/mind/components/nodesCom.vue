<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 20:15:16
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 21:09:06
-->
<template>
    <div class="node-wrap">
        <h4>节点</h4>
        <div>
            <el-tooltip effect="dark" content="圆形节点" placement="bottom">
                <svg-icon name="around" size="48px" />
            </el-tooltip>

            <el-tooltip effect="dark" content="正方形节点" placement="bottom">
                <svg-icon name="square" size="48px" />
            </el-tooltip>

            <el-tooltip effect="dark" content="条件节点" placement="bottom">
                <svg-icon name="route-square" size="48px" />
            </el-tooltip>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.node-wrap {
    box-sizing: border-box;
    padding: 10px;
    h4 {
        text-align: center;
        margin: 10px 0;
    }
}
</style>
