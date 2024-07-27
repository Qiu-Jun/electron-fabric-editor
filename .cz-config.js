/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-29 14:01:59
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 02:00:32
 */
'use strict'

module.exports = {
  types: [
    {
      value: ':construction: WIP',
      name: '💪  WIP:      Work in progress(开发中)'
    },
    {
      value: ':sparkles: feat',
      name: '✨  feat:     A new feature(新功能)'
    },
    {
      value: ':bug: fix',
      name: '🐛  fix:      A bug fix(修复bug)'
    },
    {
      value: ':hammer: refactor',
      name: '🔨  refactor: A code change that neither fixes a bug nor adds a feature(代码重构,既没修复bug也没有添加新功能)'
    },
    {
      value: ':pencil: docs',
      name: '📝  docs:     Documentation only changes'
    },
    {
      value: ':white_check_mark: test',
      name: '✅  test:     Add missing tests or correcting existing tests'
    },
    {
      value: ':thought_balloon: chore',
      name: "🚀  chore:    Changes that don't modify src or test files. Such as updating build tasks, package manager"
    },
    {
      value: ':lipstick: ui',
      name: '💄 Updating the UI and style files.'
    },
    {
      value: ':art: style',
      name: '🎨 Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
    },
    {
      value: 'revert',
      name: '⏪  revert:   Revert to a commit'
    },
    {
      value: ':package: dep_up',
      name: '📦 Updating compiled files or packages.'
    },
    {
      value: ':green_heart: fixci',
      name: '💚 Fixing CI Build.'
    },
    {
      value: ':truck: mv',
      name: '🚚 Moving or renaming files.'
    },
    {
      value: ':fire: prune',
      name: '🔥 Removing code or files.'
    },
    {
      value: ':bookmark: release',
      name: '🔖 Releasing / Version tags.'
    },
    {
      value: ':rocket: first release',
      name: '🚀 first releast!'
    }
  ],

  scopes: [{ name: 'components' }, { name: 'utils' }, { name: 'styles' }, { name: 'other' }],

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix']
}
