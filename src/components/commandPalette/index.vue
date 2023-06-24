<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 18:55:54
 * @LastEditors: June
 * @LastEditTime: 2023-06-25 02:32:37
-->
<template>
    <div flex-1 mx-2>
        <el-button w-full important:justify-start @click="handleOpen">
            <span flex items-center gap-3 op-40>
                <el-icon><Search /></el-icon>
                Search...

                <span
                    hidden
                    flex-1
                    border
                    border-current
                    border-op-40
                    rounded
                    border-solid
                    px-5px
                    py-3px
                    sm:inline
                >
                    {{ isMac ? 'Cmd' : 'Ctrl' }}&nbsp;+&nbsp;K
                </span>
            </span>
        </el-button>

        <el-dialog
            v-model="isModalOpen"
            width="50%"
            top="80px"
            class="dialogHideHeader"
            :show-close="false"
            :show-header="false"
            :before-close="handleClose"
        >
            <el-input
                ref="inputRef"
                v-model="searchPrompt"
                raw-text
                placeholder="Type to search a tool or a command..."
                autofocus
                clearable
            />

            <div v-for="(options, category) in filteredSearchResult" :key="category">
                <div ml-3 mt-3 text-sm font-bold text-primary op-60>
                    {{ category }}
                </div>
                <command-palette-option
                    v-for="option in options"
                    :key="option.name"
                    :option="option"
                    :selected="selectedOptionIndex === getOptionIndex(option)"
                    @activated="activateOption"
                />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" name="CommandPalette" setup>
import { storeToRefs } from 'pinia'
import { Search } from '@element-plus/icons-vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import { chain, isUndefined } from 'lodash-es'
import commandPaletteOption from './commandPaletteOption.vue'
import useCommandPalette from '@/store/modules/commandPalette'
import type { PaletteOption } from '@/types/commandPalette'

const router = useRouter()
const isMac = computed(() => window.navigator.userAgent.toLowerCase().includes('mac'))
const isModalOpen = ref(false)
const inputRef = ref()
const selectedOptionIndex = ref(0)
const commandPaletteStore = useCommandPalette()
const { searchPrompt, filteredSearchResult } = storeToRefs(commandPaletteStore)

const keys = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') {
            e.preventDefault()
        }

        if (e.metaKey && e.key === 'k' && e.type === 'keydown') {
            e.preventDefault()
        }
    }
})

whenever(isModalOpen, () => inputRef.value?.focus())

whenever(keys.ctrl_k, handleOpen)
whenever(keys.meta_k, handleOpen)
whenever(keys.escape, handleClose)

function handleOpen() {
    return (isModalOpen.value = true)
}

function handleClose() {
    return (isModalOpen.value = false)
}

function getOptionIndex(option: PaletteOption) {
    return chain(filteredSearchResult.value)
        .values()
        .flatten()
        .findIndex((o) => o === option)
        .value()
}

function activateOption(option: PaletteOption) {
    const { closeOnSelect } = option

    if (option.action) {
        option.action()

        if (closeOnSelect) {
            close()
        }

        return
    }

    const closeAfterNavigation = closeOnSelect || isUndefined(closeOnSelect)

    if (option.to) {
        router.push(option.to)

        if (closeAfterNavigation) {
            close()
        }
        return
    }

    if (option.href) {
        window.open(option.href, '_blank')

        if (closeAfterNavigation) {
            close()
        }
    }
}
</script>
