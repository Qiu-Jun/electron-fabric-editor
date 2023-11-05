/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-31 11:54:58
 * @LastEditors: June
 * @LastEditTime: 2023-11-05 22:03:28
 */
import Psd, { Node } from '@webtoon/psd'

export async function parsePSD(file: File) {
  if (!file) return
  const result = await file.arrayBuffer()

  const psdFile = await Psd.parse(result)
  console.log(psdFile)
  const canvasElement = document.createElement('canvas')
  const context = canvasElement.getContext('2d')!
  const compositeBuffer = await psdFile.composite()
  console.log(compositeBuffer)
  //   const imageData = new ImageData(compositeBuffer, psdFile.width, psdFile.height)

  //   canvasElement.width = psdFile.width
  //   canvasElement.height = psdFile.height

  //   context.putImageData(imageData, 0, 0)
  //   document.body.append(canvasElement)
  //   console.log(arrayBufferToBase64Img(psd.icc_profile))
  console.log(psdFile)
  console.log('end======')
  transform(psdFile)
  //   return convertPSD2Sky(psd);
}

async function transform(node: Node) {
  if (node.type === 'Layer') {
    // console.log(await node.composite())
    // Do something with Layer
  } else if (node.type === 'Group') {
    // Do something with Group
  } else if (node.type === 'Psd') {
    console.log(node)
    // Do something with Psd
  } else {
    throw new Error('Invalid node type')
  }

  node.children?.forEach((child) => transform(child))
}
function Uint8ArrayToString(fileData: any) {
  let dataString = ''
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i])
  }

  return dataString
}

const arrayBufferToBase64Img = (buffer: any) => {
  const str = String.fromCharCode(buffer)
  return `data:image/jpeg;base64,${window.btoa(str)}`
}
