import Resizer from 'react-image-file-resizer'

export const resizeImage = (file, width, height) => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      'PNG',
      100,
      0,
      uri => {
        resolve(createFakeFile(uri, file.name))
      },
      'base64'
    )
  })
}

const createFakeFile = (base64Data, fileName) => {
  const blob = dataURItoBlob(base64Data)

  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now()
  })
}

const dataURItoBlob = dataURI => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], { type: mimeString })
}
