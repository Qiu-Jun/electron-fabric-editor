/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-25 14:39:41
 * @LastEditTime: 2024-07-26 12:15:29
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\hooks\select.ts
 */
import Editor from '@/lib/core'
import { useI18n } from 'vue-i18n'
import { Selector } from './useSelectListen'

// interface Selector {
//   mSelectMode: (typeof SelectMode)[keyof typeof SelectMode];
//   mSelectOneType: string | undefined;
//   mSelectId: string | undefined;
//   mSelectIds: (string | undefined)[];
//   mSelectActive: unknown[];
// }

export default function useSelect() {
  const fabric = inject('fabric')
  const { t } = useI18n()
  const canvasEditor = inject('canvasEditor') as Editor
  const mixinState = inject('mixinState') as Selector

  return {
    fabric,
    canvasEditor,
    mixinState,
    t
  }
}
