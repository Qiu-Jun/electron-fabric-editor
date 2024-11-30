import { fabric } from 'fabric'

export interface ColorStop {
  color: string
  offset: number
  opacity?: number
}

export interface Template {
  id: string
  name?: string
  version: string
  workSpace?: WorkSpaceElement
  background?: string
  backgroundImage?: any
  zoom: number
  width: number
  height: number
  objects: fabric.Object[]
  image?: string
  preview?: Blob | null
}

export interface WorkSpaceElement {
  fill?: string | fabric.Gradient | fabric.Pattern
  left: number
  top: number
  fillType?: number
  angle: number
  scaleX: number
  scaleY: number
  color?: string
  opacity?: number
  imageURL?: string
  imageSize?: 'cover' | 'contain' | 'repeat'
  gaidImageURL?: string
  gaidImageMode?: string
  shadingImageURL?: string
  gradientType?: 'linear' | 'radial'
  gradientName?: string
  gradientColor?: ColorStop[]
  gradientRotate?: number
  backgroundColor?: string
}
