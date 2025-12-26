import { createVNode, ref, render, getCurrentInstance, nextTick } from 'vue'
import { CModal, type CModalInstance } from './modal'
import type { HookModalProps } from './types'
import type { App, ComponentInternalInstance, FunctionalComponent } from 'vue'

let _app: App

export const useModal = () => {
  let _modalInstance: ComponentInternalInstance
  const modalRef = ref<CModalInstance>()
  const appContext = _app?._context || getCurrentInstance()?.appContext

  // 当前模态框是否处于App.vue上下文中
  const isAppChild = ref(false)
  const setProps = async (_props: any) => {
    const instance = await getModalInstance()
    if (Object.is(instance, modalRef.value)) {
      // @ts-ignore
      instance?.setProps?.(_props)
    } else {
      // @ts-ignore
      instance?.exposed?.setProps?.(_props)
    }
  }
  const show = async (props: HookModalProps) => {
    setProps({
      ...props,
      closeModal: hide,
      open: true
    })

    await nextTick()
  }
  const hide = () => {
    setProps({ open: false })
  }
  const getModalInstance = async () => {
    await nextTick()
    if (isAppChild.value && modalRef.value) {
      return modalRef.value
    }

    if (_modalInstance) {
      return _modalInstance
    }
    const container = document.createElement('div')
    const vnode = createVNode(CModal)
    vnode.appContext = appContext
    render(vnode, container)
    _modalInstance = vnode.component!
    _modalInstance.props.closeModal = hide
    return _modalInstance
  }

  interface ModalComp<T> extends FunctionalComponent<T> {
    show: typeof show
    hide: typeof hide
    setProps: typeof setProps
  }

  const Modal: ModalComp<HookModalProps> = (props, { attrs, slots }) => {
    isAppChild.value = true
    return <CModal ref={modalRef} {...{ ...attrs, ...props }} v-slots={slots} />
  }

  Modal.show = show
  Modal.hide = hide
  Modal.setProps = setProps

  return { Modal, modalRef } as const
}

export type ModalInstance = ReturnType<typeof useModal>
