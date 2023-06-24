/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-25 01:17:55
 * @LastEditors: June
 * @LastEditTime: 2023-06-25 01:25:58
 */
export default function useNav() {
    const router = useRouter()
    const $to = (navOps: any) => {
        router.push(navOps)
    }
    return $to
}
