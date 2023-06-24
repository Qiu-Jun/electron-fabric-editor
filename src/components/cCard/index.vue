<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 23:17:44
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 23:22:26
-->
<template>
    <div class="colored-card">
        <el-icon class="icon" size="40" :component="icon" />
        <h3 class="title">
            {{ title }}
        </h3>

        <div class="description">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" name="ColorCard" setup>
import type { Component } from 'vue'

const props = defineProps<{ icon: Component; title: string }>()
const { icon, title } = toRefs(props)
</script>

<style lang="scss" scoped>
.colored-card {
    background: rgb(37, 99, 108);
    background: linear-gradient(
        48deg,
        rgba(37, 99, 108, 1) 0%,
        rgba(59, 149, 111, 1) 60%,
        rgba(20, 160, 88, 1) 100%
    );
    color: #fff;
    border: none;

    .icon {
        opacity: 0.7;
    }

    .title {
        width: 100%;
        color: #fff;
        margin: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .description {
        opacity: 0.8;
        margin: 5px 0;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;

        :v-deep(a) {
            color: inherit;
            text-decoration: underline;
            font-weight: bold;
            transition: color ease 0.2s;

            &:hover {
                color: rgb(20, 20, 20);
            }
        }
    }
}
</style>
