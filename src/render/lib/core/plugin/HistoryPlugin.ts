/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: June
 * @LastEditTime: 2024-11-02 22:17:24
 * @Description: 历史记录插件
 */
import { fabric } from 'fabric'
import '../utils/fabric-history.js'
import type { IEditor, IPluginTempl } from '@/lib/core'

type IPlugin = Pick<HistoryPlugin, 'undo' | 'redo' | 'historyUpdate'>

declare module '@/lib/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

type callback = () => void
type extendCanvas = {
  undo: (callback?: callback) => void
  redo: (callback?: callback) => void
  clearHistory: () => void
  historyStack: any[]
  historyIndex: number
}

class HistoryPlugin implements IPluginTempl {
  static pluginName = 'HistoryPlugin'
  static apis = [
    'undo',
    'redo',
    'historyUpdate',
    'clearAndSaveState',
    'saveState'
  ]
  static events = []
  // 历史记录相关属性Add commentMore actions
  private stack: string[] = []
  private currentIndex = 0
  private maxLength = 100
  private isProcessing = false
  private isLoading = false
  hotkeys: string[] = ['ctrl+z', 'ctrl+shift+z', '⌘+z', '⌘+shift+z']
  constructor(
    public canvas: fabric.Canvas & extendCanvas,
    public editor: IEditor
  ) {
    fabric.Canvas.prototype._historyNext = () => {
      return this.editor.getJson()
    }
    this._init()
  }

  private _init() {
    // 监听对象变更事件Add commentMore actions
    const events = {
      'object:removed': () => this.saveState(),
      'object:modified': () => this.saveState(),
      'object:skewing': () => this.saveState()
    }

    // 绑定事件
    Object.entries(events).forEach(([event, handler]) => {
      this.canvas.on(event, handler)
    })

    // 初始化状态
    this.saveState()

    // 更新历史记录状态
    this.canvas.on('history:append', () => {
      this.historyUpdate()
    })
    window.addEventListener('beforeunload', (e) => {
      const { undoCount } = this.getState()
      if (undoCount > 0) {
        ;(e || window.event).returnValue = '确认离开'
      }
    })
  }

  // 获取当前状态Add commentMore actions
  private getCurrentState() {
    return this.editor.getJson()
  }

  // 保存状态Add commentMore actions
  private saveState() {
    if (this.isProcessing) return

    // 清除当前索引后的记录
    this.stack.splice(this.currentIndex)
    this.stack.push(this.getCurrentState())

    // 维护最大长度
    if (this.stack.length > this.maxLength) {
      this.stack.shift()
    } else {
      this.currentIndex++
    }
    this.historyUpdate()
  }

  // 加载状态
  private _loadState(state: string, eventName: string, callback?: callback) {
    this.isLoading = true
    this.isProcessing = true

    // 处理 workspace 的特殊情况
    const parsedState = JSON.parse(state)
    const workspace = parsedState.objects?.find(
      (item: any) => item.id === 'workspace'
    )
    if (workspace) {
      workspace.evented = false
    }

    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll()
      this.canvas.fire(eventName)
      this.isProcessing = false
      this.isLoading = false
      callback?.()
    })
  }

  // 获取历史记录状态
  private getState() {
    return {
      undoCount: this.currentIndex - 1,
      redoCount: this.stack.length - this.currentIndex
    }
  }

  // 清空历史记录
  private clear() {
    this.stack = []
    this.currentIndex = 0
    this.saveState()
  }

  historyUpdate() {
    // const { historyStack, historyIndex } = this.canvas
    // this.editor.emit(
    //   'historyUpdate',
    //   historyIndex,
    //   historyStack.length - historyIndex
    // )
    const { undoCount, redoCount } = this.getState()
    this.editor.emit('historyUpdate', undoCount, redoCount)
  }

  // 导入模板之后，清理 History 缓存
  hookImportAfter() {
    this.clear()
    this.canvas.clearHistory(true)
    this.historyUpdate()
    return Promise.resolve()
  }

  undo() {
    if (this.isLoading || this.currentIndex <= 1) return

    this.currentIndex--
    const state = this.stack[this.currentIndex - 1]
    if (state) {
      this._loadState(JSON.stringify(state), 'history:undo')
      this.historyUpdate()
    }
  }

  redo() {
    if (this.isLoading || this.currentIndex >= this.stack.length) return

    const state = this.stack[this.currentIndex]
    if (state) {
      this._loadState(JSON.stringify(state), 'history:redo')
      this.currentIndex++
      this.historyUpdate()
    }
  }

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.type === 'keydown') {
      switch (eventName) {
        case 'ctrl+z':
        case '⌘+z':
          this.undo()
          break
        case 'ctrl+shift+z':
        case '⌘+shift+z':
          this.redo()
          break
      }
    }
  }

  clearAndSaveState() {
    const currentState = this.getCurrentState()
    this.stack = [currentState] // 只保留当前状态作为第一条记录
    this.currentIndex = 1
    this.historyUpdate()
  }
}

export default HistoryPlugin
