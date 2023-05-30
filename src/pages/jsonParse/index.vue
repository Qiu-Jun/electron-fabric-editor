<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-30 02:21:12
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 12:14:20
-->
<template>
    <div class="jsonParse-wrap">
        <div class="block-options">
            <h3>Options:</h3>
            <div class="options">
                <div>
                    <el-checkbox v-model="state.showIcon" label="showIcon" size="large" />
                </div>

                <div>
                    <el-checkbox v-model="state.showLength" label="showLength" size="large" />
                </div>
                <div>
                    <el-checkbox v-model="state.showLine" label="showLine" size="large" />
                </div>
                <div>
                    <el-checkbox
                        v-model="state.showLineNumber"
                        label="showLineNumber"
                        size="large"
                    />
                </div>
                <div>
                    <el-checkbox
                        v-model="state.showDoubleQuotes"
                        label="showDoubleQuotes"
                        size="large"
                    />
                </div>
                <div>
                    <el-checkbox
                        v-model="state.showKeyValueSpace"
                        label="showKeyValueSpace"
                        size="large"
                    />
                </div>
                <div>
                    <el-checkbox
                        v-model="state.collapsedOnClickBrackets"
                        label="collapsedOnClickBrackets"
                        size="large"
                    />
                </div>
                <div>
                    <label>deep</label>
                    <el-select v-model="state.deep" placeholder="deep" size="large">
                        <el-option key="2" :label="2" :value="2" />
                        <el-option key="3" :label="3" :value="3" />
                        <el-option key="4" :label="4" :value="4" />
                    </el-select>
                </div>
                <div>
                    <el-checkbox
                        v-model="state.setPathCollapsible"
                        label="setPathCollapsible"
                        size="large"
                    />
                </div>
            </div>

            <h3>Slots:</h3>
            <div class="options">
                <div>
                    <el-checkbox
                        v-model="state.useRenderNodeKeySlot"
                        label="renderNodeKey"
                        size="large"
                    />
                </div>
                <div>
                    <el-checkbox
                        v-model="state.useRenderNodeValueSlot"
                        label="renderNodeValue"
                        size="large"
                    />
                </div>
            </div>

            <h3>JSON:</h3>

            <el-input type="textarea" v-model="state.val" />
        </div>
        <el-scrollbar height="98vh" class="block-parse">
            <vue-json-pretty
                :data="state.data"
                :deep="state.deep"
                :path-collapsible="state.setPathCollapsible ? pathCollapsible : undefined"
                :show-double-quotes="state.showDoubleQuotes"
                :show-length="state.showLength"
                :show-line="state.showLine"
                :show-line-number="state.showLineNumber"
                :collapsed-on-click-brackets="state.collapsedOnClickBrackets"
                :show-icon="state.showIcon"
                :show-key-value-space="state.showKeyValueSpace"
                style="position: relative"
            >
                <template v-if="state.useRenderNodeKeySlot" #renderNodeKey="{ node, defaultKey }">
                    <template v-if="node.key === 'title'">
                        <a>"{{ node.key }}"</a>
                    </template>
                    <template v-else>{{ defaultKey }}</template>
                </template>

                <template
                    v-if="state.useRenderNodeValueSlot"
                    #renderNodeValue="{ node, defaultValue }"
                >
                    <template
                        v-if="
                            typeof node.content === 'string' && node.content.startsWith('http://')
                        "
                    >
                        <a :href="node.content" target="_blank">{{ node.content }}</a>
                    </template>
                    <template v-else>{{ defaultValue }}</template>
                </template>
            </vue-json-pretty>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts" name="JsonParse">
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

interface IState {
    val: string
    data: any
    showLength: boolean
    showLine: boolean
    showLineNumber: boolean
    showDoubleQuotes: boolean
    collapsedOnClickBrackets: boolean
    useRenderNodeKeySlot: boolean
    useRenderNodeValueSlot: boolean
    deep: number
    setPathCollapsible: boolean
    showIcon: boolean
    showKeyValueSpace: boolean
}
const defaultData = null
const state = reactive<IState>({
    val: JSON.stringify(defaultData),
    data: defaultData,
    showLength: false,
    showLine: true,
    showLineNumber: true,
    showDoubleQuotes: true,
    collapsedOnClickBrackets: true,
    useRenderNodeKeySlot: false,
    useRenderNodeValueSlot: false,
    deep: 4,
    setPathCollapsible: false,
    showIcon: false,
    showKeyValueSpace: true
})

const pathCollapsible = (node: any) => {
    return node.key === 'members'
}

watch(
    () => state.val,
    (newVal) => {
        try {
            state.data = JSON.parse(newVal)
        } catch (err) {
            // console.log('JSON ERROR');
        }
    }
)
</script>

<style lang="scss" scoped>
:deep(.el-textarea__inner) {
    min-height: 300px !important;
}
.jsonParse-wrap {
    display: flex;
    justify-content: space-between;

    .block-options {
        box-sizing: border-box;
        width: 40vw;
        padding: 10px;
        border-right: 1px solid #ccc;
    }
    .block-parse {
        box-sizing: border-box;
        width: 60vw;
        padding: 10px;
    }
}
</style>
