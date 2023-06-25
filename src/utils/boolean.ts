/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 02:09:36
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 02:09:59
 */
export function isNotThrowing(cb: () => unknown): boolean {
    try {
        cb()
        return true
    } catch (err) {
        return false
    }
}

export function booleanToHumanReadable(value: boolean): string {
    return value ? 'Yes' : 'No'
}
