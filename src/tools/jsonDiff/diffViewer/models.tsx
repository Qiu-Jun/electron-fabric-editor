/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 03:25:43
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 03:37:31
 */
import { isNull } from 'lodash-es'
import type { ArrayDifference, Difference, ObjectDifference } from '@/types/jsonDiff'
import useCopy from '@/hooks/copy'

export default function DiffRootViewer({ diff }: { diff: Difference }) {
    return (
        <div class={'diffs-viewer'}>
            <ul>{DiffViewer({ diff, showKeys: false })}</ul>
        </div>
    )
}

function DiffViewer({ diff, showKeys = true }: { diff: Difference; showKeys?: boolean }) {
    const { type, status } = diff

    if (status === 'updated') {
        return ComparisonViewer({ diff, showKeys })
    }

    if (type === 'array') {
        return ChildrenViewer({
            diff,
            showKeys,
            showChildrenKeys: false,
            openTag: '[',
            closeTag: ']'
        })
    }

    if (type === 'object') {
        return ChildrenViewer({ diff, showKeys, openTag: '{', closeTag: '}' })
    }

    return LineDiffViewer({ diff, showKeys })
}

function LineDiffViewer({ diff, showKeys }: { diff: Difference; showKeys?: boolean }) {
    const { value, key, status, oldValue } = diff
    const valueToDisplay = status === 'removed' ? oldValue : value

    return (
        <li>
            <span class={[status, 'result']}>
                {showKeys && (
                    <>
                        <span class={'key'}>{key}</span>
                        {': '}
                    </>
                )}
                {Value({ value: valueToDisplay, status })}
            </span>
            ,
        </li>
    )
}

function ComparisonViewer({ diff, showKeys }: { diff: Difference; showKeys?: boolean }) {
    const { value, key, oldValue } = diff

    return (
        <li class={'updated-line'}>
            {showKeys && (
                <>
                    <span class={'key'}>{key}</span>
                    {': '}
                </>
            )}
            {Value({ value: oldValue, status: 'removed' })}
            {Value({ value, status: 'added' })},
        </li>
    )
}

function ChildrenViewer({
    diff,
    openTag,
    closeTag,
    showKeys,
    showChildrenKeys = true
}: {
    diff: ArrayDifference | ObjectDifference
    showKeys: boolean
    showChildrenKeys?: boolean
    openTag: string
    closeTag: string
}) {
    const { children, key, status, type } = diff

    return (
        <li>
            <div class={[type, status]} style={{ display: 'inline-block' }}>
                {showKeys && (
                    <>
                        <span class={'key'}>{key}</span>
                        {': '}
                    </>
                )}

                {openTag}
                {children.length > 0 && (
                    <ul>
                        {children.map((diff) => DiffViewer({ diff, showKeys: showChildrenKeys }))}
                    </ul>
                )}
                {`${closeTag},`}
            </div>
        </li>
    )
}

function formatValue(value: unknown) {
    if (isNull(value)) {
        return 'null'
    }

    return JSON.stringify(value)
}

function Value({ value, status }: { value: unknown; status: string }) {
    const formatedValue = formatValue(value)

    const { copy } = useCopy({ source: formatedValue })

    return (
        <span class={['value', status]} onClick={copy}>
            {formatedValue}
        </span>
    )
}
