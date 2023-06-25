/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 02:08:28
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 02:08:36
 */

export function withDefaultOnError<A, B>(cb: () => A, defaultValue: B): A | B {
    try {
        return cb()
    } catch (err) {
        return defaultValue
    }
}

export async function withDefaultOnErrorAsync<A, B>(
    cb: () => A,
    defaultValue: B
): Promise<Awaited<A> | B> {
    try {
        return await cb()
    } catch (err) {
        return defaultValue
    }
}
