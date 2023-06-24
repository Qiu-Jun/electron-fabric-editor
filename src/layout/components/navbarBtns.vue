<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 18:35:21
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 18:40:09
-->
<template>
    <el-tooltip class="box-item" effect="dark" content="Github" placement="bottom">
        <el-button :icon="House" circle></el-button>
    </el-tooltip>

    <el-tooltip class="box-item" effect="dark" content="About" placement="bottom">
        <el-button :icon="InfoFilled" circle></el-button>
    </el-tooltip>
</template>

<script lang="ts" name="NavBarBtns" setup>
import { House, InfoFilled } from '@element-plus/icons-vue'
</script>
