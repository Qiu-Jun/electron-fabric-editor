/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-31 11:54:58
 * @LastEditors: June
 * @LastEditTime: 2023-11-01 11:09:25
 */
import Psd, { Node } from '@webtoon/psd'

export async function parsePSD(file: File) {
  if (!file) return
  const result = await file.arrayBuffer()

  const psd = await Psd.parse(result)
  console.log(arrayBufferToBase64Img(psd.icc_profile))
  traverseNode(psd)
  // return convertPSD2Sky(psd);
}

async function traverseNode(node: Node) {
  if (node.type === 'Layer') {
    // Do something with Layer
  } else if (node.type === 'Group') {
    // Do something with Group
  } else if (node.type === 'Psd') {
    console.log(node)
    // Do something with Psd
  } else {
    throw new Error('Invalid node type')
  }

  node.children?.forEach((child) => traverseNode(child))
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
