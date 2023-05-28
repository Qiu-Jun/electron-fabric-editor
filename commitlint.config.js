/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-17 00:13:46
 * @LastEditors: June
 * @LastEditTime: 2023-03-17 00:31:04
 */
module.exports = {
    extents: ['@commitlint/config-conventional', 'cz'],
    rules: {
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test'
            ]
        ]
    }
}
