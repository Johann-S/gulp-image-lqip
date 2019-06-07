'use strict'

const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const pretty = require('pretty')
const { processImage } = require('./process-image')

const validImgExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tif', '.tiff', '.gif']

const processHtml = (pathHtml, config) => new Promise((resolve, reject) => {
  const dir = config.rootPath
  const fileContent = fs.readFileSync(pathHtml, { encoding: 'utf8' })
  const $ = cheerio.load(fileContent)
  const imageList = $('img').toArray()

  const promiseList = imageList.filter(el => {
    const src = $(el).attr(config.srcAttr)

    // @todo: handle that case later
    if (!src || src.startsWith('http') || src.startsWith('https') || src.startsWith('//')) {
      return false
    }

    const pathImg = path.join(dir, src)

    return validImgExtensions.includes(path.extname(pathImg).toLowerCase())
  })
    .map(el => {
      const src = $(el).attr(config.srcAttr)
      const pathImg = path.join(dir, src)

      return processImage(pathImg, src)
    })

  Promise.all(promiseList)
    .then(resultList => {
      resultList.forEach(({ originImg, base64 }) => {
        const image = imageList.find(el => $(el).attr(config.srcAttr) === originImg && !$(el).attr(config.attribute))

        $(image).attr(config.attribute, base64)
      })

      fs.writeFileSync(pathHtml, pretty($.html(), { ocd: true }), { encoding: 'utf8' })
      resolve()
    })
    .catch(error => reject(error))
})

module.exports = {
  processHtml
}
