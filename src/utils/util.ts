/**
 * @desc 打开新窗口
 */
export function openNewWin(url: string, type?: string) {
    if (!url) return false
    return window.open(url, type || '_blank')
}
