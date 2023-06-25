<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 03:14:28
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 04:08:46
-->
<template>
    <el-input
        v-model="rawLeftJson"
        :rows="20"
        type="textarea"
        label="Your first JSON"
        placeholder="Paste your first JSON here..."
    />

    <el-input
        v-model="rawRightJson"
        :rows="20"
        type="textarea"
        label="Your JSON to compare"
        placeholder="Paste your JSON to compare here..."
    />

    <diffsViewer :left-json="leftJson" :right-json="rightJson" />
</template>

<script lang="ts" name="JSONDiff" setup>
import JSON5 from 'json5'
import diffsViewer from './diffViewer/diffViewer.vue'
import { withDefaultOnError } from '@/utils/defaults'
import { isNotThrowing } from '@/utils/boolean'

const rawLeftJson = ref('')
const rawRightJson = ref('')

const leftJson = computed(() => withDefaultOnError(() => JSON5.parse(rawLeftJson.value), undefined))
const rightJson = computed(() =>
    withDefaultOnError(() => JSON5.parse(rawRightJson.value), undefined)
)

const jsonValidationRules = [
    {
        validator: (value: string) => value === '' || isNotThrowing(() => JSON5.parse(value)),
        message: 'Invalid JSON format'
    }
]
</script>
