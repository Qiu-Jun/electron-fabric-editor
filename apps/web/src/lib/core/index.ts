/*
 * @Author: 秦少卫
 * @Date: 2023-02-03 23:29:34
 * @LastEditors: June
 * @LastEditTime: 2024-11-02 22:19:36
 * @Description: 核心入口文件
 */
import Editor from './Editor'
import EventType from './eventType'
import CustomRect from './objects/CustomRect'
import CustomTextbox from './objects/CustomTextbox'
import Utils from './utils/utils'

export { default as AddBaseTypePlugin } from './plugin/AddBaseTypePlugin'
export { default as AlignGuidLinePlugin } from './plugin/AlignGuidLinePlugin'
export { default as BarCodePlugin } from './plugin/BarCodePlugin'
export { default as CenterAlignPlugin } from './plugin/CenterAlignPlugin'
export { default as ControlsPlugin } from './plugin/ControlsPlugin'
export { default as ControlsRotatePlugin } from './plugin/ControlsRotatePlugin'
export { default as CopyPlugin } from './plugin/CopyPlugin'
export { default as DeleteHotKeyPlugin } from './plugin/DeleteHotKeyPlugin'
export { default as DrawLinePlugin } from './plugin/DrawLinePlugin'
export { default as DrawPolygonPlugin } from './plugin/DrawPolygonPlugin'
export { default as DringPlugin } from './plugin/DringPlugin'
export { default as FlipPlugin } from './plugin/FlipPlugin'
export { default as FontPlugin } from './plugin/FontPlugin'
export { default as FreeDrawPlugin } from './plugin/FreeDrawPlugin'
export { default as GroupAlignPlugin } from './plugin/GroupAlignPlugin'
export { default as GroupPlugin } from './plugin/GroupPlugin'
export { default as GroupTextEditorPlugin } from './plugin/GroupTextEditorPlugin'
export { default as HistoryPlugin } from './plugin/HistoryPlugin'
export { default as ImageStroke } from './plugin/ImageStroke'
export { default as LayerPlugin } from './plugin/LayerPlugin'
export { default as LockPlugin } from './plugin/LockPlugin'
export { default as MaskPlugin } from './plugin/MaskPlugin'
export { default as MaterialPlugin } from './plugin/MaterialPlugin'
export { default as MoveHotKeyPlugin } from './plugin/MoveHotKeyPlugin'
export { default as PathTextPlugin } from './plugin/PathTextPlugin'
export { default as PolygonModifyPlugin } from './plugin/PolygonModifyPlugin'
export { default as PsdPlugin } from './plugin/PsdPlugin'
export { default as QrCodePlugin } from './plugin/QrCodePlugin'
export { default as ResizePlugin } from './plugin/ResizePlugin'
export { default as RulerPlugin } from './plugin/RulerPlugin'
export { default as SimpleClipImagePlugin } from './plugin/SimpleClipImagePlugin'
export { default as WaterMarkPlugin } from './plugin/WaterMarkPlugin'
export { default as WorkspacePlugin } from './plugin/WorkspacePlugin'
export { CustomRect, CustomTextbox, EventType, Utils }
export default Editor

export * from '@/interface/Editor'
