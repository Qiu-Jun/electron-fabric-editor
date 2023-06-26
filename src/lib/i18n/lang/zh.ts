/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-25 01:37:24
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 16:38:59
 */
export default {
    zh: '中文', // 特殊，用于切换
    tips: {
        home: '首页',
        about: '关于'
    },
    title: {
        allTools: '所有工具'
    },
    favorite: {
        add: '添加到收藏夹',
        remove: '从收藏夹中删除'
    },
    tools: {
        phoneParse: {
            name: '电话号码解析器和格式化器',
            desc: '解析、验证和格式化电话号码。获取有关电话号码的信息，如国家代码、类型等。',
            placeholder: '请输入电话号码',
            cc: '默认国家代码',
            phoneNumber: '电话号码',
            country: '国家',
            countryCode: '国家呼叫代码',
            isValid: '是否有效?',
            isPossible: '是否可能?',
            type: '类型',
            intFormat: '国际格式',
            nationalFormat: '国家的格式',
            E164Format: 'E.164格式',
            RFC3966Format: 'RFC3966格式'
        },
        jsonDiff: {
            name: 'JSON对比',
            desc: '比较两个JSON对象并获得它们之间的差异。',
            firstJsonLabel: '第一个JSON',
            firstPlaceholder: '粘贴你的第一个JSON在这里…',
            secondJsonLabel: '要比较的JSON',
            secondPlaceholder: '粘贴你的JSON来比较这里…',
            sameTips: '所提供的json相同',
            switchLabel: '只显示差异',
            jsonValidateErr: '无效的JSON格式'
        }
    },
    regMsg: {
        phone: '无效电话号码'
    }
}
