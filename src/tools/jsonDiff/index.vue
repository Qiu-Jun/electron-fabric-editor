<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 03:14:28
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 15:40:48
-->
<template>
    <el-form flex justify-center w800px label-position="top" :model="formModel" :rules="formRules">
        <el-form-item label="Your first JSON" mr-5 flex-1 prop="rawLeftJson">
            <el-input
                v-model="formModel.rawLeftJson"
                :rows="20"
                type="textarea"
                placeholder="Paste your first JSON here..."
            />
        </el-form-item>

        <el-form-item label="Your JSON to compare" flex-1 prop="rawRightJson">
            <el-input
                flex-1
                v-model="formModel.rawRightJson"
                :rows="20"
                type="textarea"
                placeholder="Paste your JSON to compare here..."
            />
        </el-form-item>
    </el-form>

    <diffsViewer w800px :left-json="leftJson" :right-json="rightJson" />
</template>

<script lang="ts" name="JSONDiff" setup>
import JSON5 from 'json5'
import diffsViewer from './diffViewer/diffViewer.vue'
import { withDefaultOnError } from '@/utils/defaults'
import { isNotThrowing } from '@/utils/boolean'

const formModel = reactive({
    rawLeftJson: '',
    rawRightJson: ''
})

const validateJson = (rule: any, value: string, callback: any) => {
    if (value === '' || (value && isNotThrowing(() => JSON5.parse(value)))) {
        callback()
    } else {
        callback(new Error('Invalid JSON format'))
    }
}
const formRules = {
    rawLeftJson: [{ validator: validateJson, trigger: 'change' }],
    rawRightJson: [{ validator: validateJson, trigger: 'change' }]
}

const leftJson = computed(() =>
    withDefaultOnError(() => JSON5.parse(formModel.rawLeftJson), undefined)
)
const rightJson = computed(() =>
    withDefaultOnError(() => JSON5.parse(formModel.rawRightJson), undefined)
)
</script>
