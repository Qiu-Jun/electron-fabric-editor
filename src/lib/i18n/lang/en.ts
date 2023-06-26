/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-25 01:37:41
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 16:36:04
 */
export default {
    en: 'English', // 特殊，用于切换
    tips: {
        home: 'Home',
        about: 'About'
    },
    title: {
        allTools: 'All Tools'
    },
    favorite: {
        add: 'Add to favorites',
        remove: 'Remove from favorites'
    },
    tools: {
        phoneParse: {
            name: 'Phone parser and formatter',
            desc: 'Parse, validate and format phone numbers. Get information about the phone number, like the country code, type, etc.',
            placeholder: 'Enter a phone number',
            cc: 'Default country code',
            phoneNumber: 'Phone number',
            country: 'Country',
            countryCode: 'Country calling code',
            isValid: 'Is valid?',
            isPossible: 'Is possible?',
            type: 'Type',
            intFormat: 'International format',
            nationalFormat: 'National format',
            E164Format: 'E.164 format',
            RFC3966Format: 'RFC3966 format'
        },
        jsonDiff: {
            name: 'JSON diff',
            desc: 'Compare two JSON objects and get the differences between them.',
            firstJsonLabel: 'Your first JSON',
            firstPlaceholder: 'Paste your first JSON here...',
            secondJsonLabel: 'Your JSON to compare',
            secondPlaceholder: 'Paste your JSON to compare here...',
            sameTips: 'The provided JSONs are the same',
            switchLabel: 'Only show differences',
            jsonValidateErr: 'Invalid JSON format'
        }
    },
    regMsg: {
        phone: 'Invalid phone number'
    }
}
