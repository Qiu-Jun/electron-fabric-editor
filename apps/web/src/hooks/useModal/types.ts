import type { DialogProps } from 'element-plus'

// 普通模态框
export interface HookModalProps extends Partial<DialogProps> {
  /** 当前模态框是否处于App.vue上下文中 */
  open: boolean
  isAppChild?: boolean
  content?: string | JSX.Element | (() => JSX.Element)
  closeModal?: () => void
  onOk?: (args: any) => void
  onCancel?: (args: any) => void
}
