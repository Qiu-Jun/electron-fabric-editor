export interface Template {
  id: string
  name?: string
  version: string
  zoom: number
  width: number
  height: number
  // 完整画布JSON字符串(editor.getJson()产物),页面快照以此为准
  json: string
  // 页面缩略图(blob: URL)
  image?: string
  preview?: Blob | null
}
