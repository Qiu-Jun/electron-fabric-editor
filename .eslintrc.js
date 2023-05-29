/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 14:19:59
 * @LastEditors: June
 * @LastEditTime: 2023-05-29 10:12:34
 */
module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        './.eslintrc-auto-import.json'
    ],
    overrides: [],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
    }
}
