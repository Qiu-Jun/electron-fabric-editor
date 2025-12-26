/*
 * @Author: June
 * @Description: Description
 * @Date: 2024-10-03 11:51:04
 * @LastEditTime: 2024-11-22 14:28:37
 * @LastEditors: June
 */
// 是否https 等开头
export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const isUrl = (src: string) => {
  try {
    const newUrl = new URL(src)
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:'
  } catch (err) {
    return false
  }
}

function toDataUrl(url: string): Promise<string | ArrayBuffer | null> {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function () {
      var reader = new FileReader()
      reader.onloadend = function () {
        resolve(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  })
}

export async function src2blob(src: string) {
  let dataURL = src
  if (isUrl(src)) {
    dataURL = (await toDataUrl(src)) as string
  }
  if (!dataURL) return
  let arr = dataURL.split(',') as any[]
  let mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
