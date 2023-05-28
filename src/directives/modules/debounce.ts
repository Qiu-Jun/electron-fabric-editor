/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-28 21:26:42
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 21:26:51
 */
import type { Directive, DirectiveBinding } from 'vue'
interface ElType extends HTMLElement {
    __handleClick__: () => void
}
const debounce: Directive = {
    mounted(el: ElType, binding: DirectiveBinding) {
        if (typeof binding.value !== 'function') {
            throw 'callback must be a function'
        }
        const wait = binding.arg ? ~~binding.arg : 500
        let timer: NodeJS.Timeout | null = null
        el.__handleClick__ = function () {
            if (timer) {
                clearInterval(timer)
            }
            timer = setTimeout(() => {
                binding.value()
            }, wait)
        }
        el.addEventListener('click', el.__handleClick__)
    },
    beforeUnmount(el: ElType) {
        el.removeEventListener('click', el.__handleClick__)
    }
}

export default debounce
