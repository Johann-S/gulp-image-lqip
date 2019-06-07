const path = require('path')
const jimp = require('jimp')

const supportedMimetypes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  tif: 'image/tiff',
  tiff: 'image/tiff'
}

const toBase64 = (extMimeType, data) => {
  return `data:${extMimeType};base64,${data.toString('base64')}`
}

const processImage = (pathImg, originImg) => new Promise((resolve, reject) => {
  const extension = path.extname(pathImg)
    .split('.')
    .pop()

  jimp.read(pathImg)
    .then(image => image.resize(10, jimp.AUTO))
    .then(image => {
      image.getBuffer(supportedMimetypes[extension], (err, data) => {
        if (err) {
          return reject(err)
        }

        if (data) {
          return resolve({
            pathImg,
            originImg,
            base64: toBase64(supportedMimetypes[extension], data)
          })
        }

        return reject(new Error('Unable to generate data from this svg'))
      })
    })
    .catch(error => reject(error))
})

module.exports = {
  processImage
}
