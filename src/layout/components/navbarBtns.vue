<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 18:35:21
 * @LastEditors: June
 * @LastEditTime: 2023-06-25 02:49:44
-->
<template>
    <el-tooltip class="box-item" effect="dark" content="Github" placement="bottom">
        <el-button circle @click="() => openNewWin(GITHUB)">
            <svg-icon name="github" size="24px" color="#333" />
        </el-button>
    </el-tooltip>

    <el-tooltip class="box-item" effect="dark" :content="$t('tips.about')" placement="bottom">
        <el-button :icon="InfoFilled" circle @click="() => $to('/about')"></el-button>
    </el-tooltip>

    <el-dropdown @command="handleCommand" ml-3>
        <el-button pain>
            {{ $t(locale) }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="item in langList"
                    :key="item.command"
                    :command="item.command"
                    >{{ item.text }}</el-dropdown-item
                >
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" name="NavBarBtns" setup>
import { InfoFilled, ArrowDown } from '@element-plus/icons-vue'
import { openNewWin } from '@/utils/util'
import { GITHUB } from '@/config/constants/app'
import useNav from '@/hooks/navTo'
import { setLocal } from '@/lib/local'
import { LANG } from '@/config/constants/app'

const $to = useNav()

const langList = [
    {
        command: 'zh',
        text: '中文'
    },
    {
        command: 'en',
        text: 'English'
    }
]
const { locale } = useI18n()
const handleCommand = (command: string) => {
    locale.value = command
    setLocal(LANG, command)
}
</script>
