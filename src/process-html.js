'use strict'

const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const pretty = require('pretty')
const { processImage } = require('./process-image')

const validImgExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.bmp',
  '.tif',
  '.tiff',
  '.gif'
]

const processHtml = (pathHtml, config) => new Promise((resolve, reject) => {
  const { rootPath, attribute, srcAttr, pretty: prettyHtml } = config
  const fileContent = fs.readFileSync(pathHtml, { encoding: 'utf8' })
  const $ = cheerio.load(fileContent)
  const imageList = $('img').toArray()

  const promiseList = imageList.filter(el => {
    const src = $(el).attr(srcAttr)

    // @todo: handle remote images later
    if (!src || src.startsWith('http') || src.startsWith('https') || src.startsWith('//')) {
      return false
    }

    const pathImg = path.join(rootPath, src)

    return validImgExtensions.includes(path.extname(pathImg).toLowerCase())
  })
    .map(el => {
      const src = $(el).attr(srcAttr)
      const pathImg = path.join(rootPath, src)

      return processImage(pathImg, src)
    })

  Promise.all(promiseList)
    .then(resultList => {
      resultList.forEach(({ originImg, base64 }) => {
        const image = imageList.find(el => $(el).attr(srcAttr) === originImg && !$(el).attr(attribute))

        $(image).attr(attribute, base64)
      })

      const data = prettyHtml ?
        pretty($.html(), { ocd: true }) :
        $.html()

      fs.writeFile(pathHtml, data, err => {
        if (err) {
          throw err
        }

        resolve()
      })
    })
    .catch(error => reject(error))
})

module.exports = {
  processHtml
}
