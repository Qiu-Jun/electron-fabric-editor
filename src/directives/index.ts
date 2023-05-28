/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 21:26:34
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 21:36:42
 */
import { App, Directive } from 'vue'
import debounce from './modules/debounce'

const directiveList: { [key: string]: Directive } = {
    debounce
}

const directives = {
    install: function (app: App<Element>) {
        Object.keys(directiveList).forEach((key) => {
            app.directive(key, directiveList[key])
        })
    }
}

export default directives
