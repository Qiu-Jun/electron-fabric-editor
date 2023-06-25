/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 02:56:19
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 02:56:24
 */
export type DifferenceStatus = 'added' | 'removed' | 'updated' | 'unchanged' | 'children-updated'

export interface ObjectDifference {
    key: string | number
    type: 'object'
    children: Difference[]
    status: DifferenceStatus
    oldValue: unknown
    value: unknown
}

export interface ValueDifference {
    key: string | number
    type: 'value'
    value: unknown
    oldValue: unknown
    status: DifferenceStatus
}

export interface ArrayDifference {
    key: number | string
    type: 'array'
    children: Difference[]
    status: DifferenceStatus
    oldValue: unknown
    value: unknown
}

export type Difference = ObjectDifference | ValueDifference | ArrayDifference
