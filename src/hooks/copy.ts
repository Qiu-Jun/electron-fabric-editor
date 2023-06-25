/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 03:26:13
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 03:33:13
 */
import { type MaybeRef, get, useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'

export default function useCopy({
    source,
    text = 'Copied to the clipboard'
}: {
    source: MaybeRef<unknown>
    text?: string
}) {
    const { copy } = useClipboard({ source: computed(() => String(get(source))) })

    return {
        async copy() {
            await copy()
            ElMessage.success(text)
        }
    }
}
