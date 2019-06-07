const path = require('path')
const fs = require('fs')
const lqip = require('lqip')
const cheerio = require('cheerio')
const pretty = require('pretty')

const validImgExtensions = ['.jpg', '.jpeg', '.png']

const lqipFile = (pathImg, originImg) => new Promise((resolve, reject) => {
  lqip.base64(pathImg)
    .then(result => {
      resolve({
        pathImg,
        originImg,
        base64: result
      })
    })
    .catch(error => reject(error))
})

const processHtmlFile = (pathHtml, config) => new Promise((resolve, reject) => {
  const dir = config.rootPath
  const fileContent = fs.readFileSync(pathHtml, { encoding: 'utf8' })
  const $ = cheerio.load(fileContent)
  const imageList = $('img').toArray()

  const promiseList = imageList.filter(el => {
    const src = $(el).attr('src')

    // @todo: handle that case later
    if (src.startsWith('http') || src.startsWith('https')) {
      return false
    }

    const pathImg = path.join(dir, src)

    return validImgExtensions.includes(path.extname(pathImg).toLowerCase())
  })
    .map(el => {
      const src = $(el).attr('src')
      const pathImg = path.join(dir, src)

      return lqipFile(pathImg, src)
    })

  Promise.all(promiseList)
    .then(resultList => {
      resultList.forEach(({ originImg, base64 }) => {
        const image = imageList.find(el => $(el).attr('src') === originImg && !$(el).attr(config.attribute))

        $(image).attr(config.attribute, base64)
      })

      fs.writeFileSync(pathHtml, pretty($.html(), { ocd: true }), { encoding: 'utf8' })
      resolve()
    })
    .catch(error => reject(error))
})

module.exports = {
  processHtmlFile
}
