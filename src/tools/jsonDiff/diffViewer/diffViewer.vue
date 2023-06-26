<template>
    <div v-if="showResults">
        <el-form flex justify-center>
            <el-form-item :label="$t('tools.jsonDiff.switchLabel')">
                <el-switch v-model="onlyShowDifferences" />
            </el-form-item>
        </el-form>

        <el-card>
            <el-text v-if="jsonAreTheSame" block text-center italic>
                {{ $t('tools.jsonDiff.sameTips') }}
            </el-text>
            <DiffRootViewer v-else :diff="result" />
        </el-card>
    </div>
</template>

<script lang="ts" namg="DiffViewer" setup>
import { isEqual, isUndefined } from 'lodash-es'
import diff from '../models'
import DiffRootViewer from './models'

const props = defineProps<{ leftJson: unknown; rightJson: unknown }>()
const onlyShowDifferences = ref(false)
const { leftJson, rightJson } = toRefs(props)

const result = computed(() =>
    diff(leftJson.value, rightJson.value, { onlyShowDifferences: onlyShowDifferences.value })
)

const jsonAreTheSame = computed(() => isEqual(leftJson.value, rightJson.value))
const showResults = computed(() => !isUndefined(leftJson.value) && !isUndefined(rightJson.value))
</script>

<style lang="scss" scoped>
:deep(.diffs-viewer) {
    color: yellow;

    & > ul {
        padding-left: 0 !important;
    }

    ul {
        list-style: none;
        padding-left: 20px;
        margin: 0;

        li {
            .updated-line {
                padding: 3px 0;
            }

            .result,
            .array,
            .object,
            .value {
                &:not(:last-child) {
                    margin-right: 4px;
                }

                &.added {
                    padding: 3px 5px;
                    border-radius: 4px;
                    background-color: #18a0582f;
                    color: #18a058;
                    .key {
                        color: inherit;
                    }
                }

                &.removed {
                    padding: 3px 5px;
                    border-radius: 4px;
                    background-color: #d030502a;
                    color: #d03050;

                    .key {
                        color: inherit;
                    }
                }
            }

            .value {
                cursor: pointer;
                border: 1px solid transparent;
                transition: border-color 0.2s ease-in-out;

                &.added:hover {
                    border-color: #18a058;
                }

                &.removed:hover {
                    border-color: #d03050;
                }
            }

            .added .added,
            .removed .removed {
                background-color: transparent;
                color: inherit;
            }

            .key {
                font-weight: 500;
                color: blue;
            }
        }
    }
}
</style>
