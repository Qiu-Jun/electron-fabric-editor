<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 22:56:24
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 02:47:51
-->
<template>
    <el-form>
        <el-form-item :label="$t('tools.phoneParse.cc')">
            <el-select v-model="defaultCountryCode" filterable>
                <el-option
                    v-for="item in countriesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>

        <el-form-item :label="$t('tools.phoneParse.phoneNumber')">
            <el-input
                v-model="rawPhone"
                :placeholder="$t('tools.phoneParse.placeholder')"
                :label="$t('tools.phoneParse.phoneNumber')"
                :validation="validation"
            />
        </el-form-item>

        <el-form-item v-show="parsedDetails">
            <el-table :data="parsedDetails" border style="width: 360px">
                <el-table-column prop="label" label="label" width="180" />
                <el-table-column prop="value" label="value" width="180" />
            </el-table>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" name="PhoneParseAndFormat" setup>
import lookup from 'country-code-lookup'
import useValidation from '@/hooks/validation'
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js/max'
import { formatTypeToHumanReadable, getDefaultCountryCode, getFullCountryName } from './models'
import { booleanToHumanReadable } from '@/utils/boolean'
import { withDefaultOnError } from '@/utils/defaults'

const { t } = useI18n()
const defaultCountryCode = ref(getDefaultCountryCode())
const rawPhone = ref('')
const validation = useValidation({
    source: rawPhone,
    rules: [
        {
            validator: (value) => value === '' || /^[0-9 +\-()]+$/.test(value),
            message: t('regMsg.phone')
        }
    ]
})

const parsedDetails = computed(() => {
    if (!validation.isValid) {
        return undefined
    }

    const parsed = withDefaultOnError(
        () => parsePhoneNumber(rawPhone.value, defaultCountryCode.value),
        undefined
    )

    if (!parsed) {
        return undefined
    }

    return [
        {
            label: t('tools.phoneParse.country'),
            value: parsed.country
        },
        {
            label: t('tools.phoneParse.country'),
            value: getFullCountryName(parsed.country)
        },
        {
            label: t('tools.phoneParse.countryCode'),
            value: parsed.countryCallingCode
        },
        {
            label: t('tools.phoneParse.isValid'),
            value: booleanToHumanReadable(parsed.isValid())
        },
        {
            label: t('tools.phoneParse.isPossible'),
            value: booleanToHumanReadable(parsed.isPossible())
        },
        {
            label: t('tools.phoneParse.type'),
            value: formatTypeToHumanReadable(parsed.getType())
        },
        {
            label: t('tools.phoneParse.intFormat'),
            value: parsed.formatInternational()
        },
        {
            label: t('tools.phoneParse.nationalFormat'),
            value: parsed.formatNational()
        },
        {
            label: t('tools.phoneParse.E164Format'),
            value: parsed.format('E.164')
        },
        {
            label: t('tools.phoneParse.RFC3966Format'),
            value: parsed.format('RFC3966')
        }
    ]
})

const countriesOptions = getCountries().map((code) => ({
    label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
    value: code,
    a: lookup.byIso(code)
}))
</script>
