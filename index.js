'use strict'

const path = require('path')
const fs = require('fs')
const lqip = require('lqip')
const through = require('through2')
const PluginError = require('plugin-error')
const cheerio = require('cheerio')

const PLUGIN_NAME = 'gulp-image-lqip'
const validImgExtensions = ['.jpg', '.jpeg', '.png']
const validFileExtensions = ['.html']

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

const processHtmlFile = (pathHtml, attribute) => new Promise((resolve, reject) => {
  const { dir } = path.parse(pathHtml)
  const fileContent = fs.readFileSync(pathHtml, { encoding: 'utf8' })
  const $ = cheerio.load(fileContent)
  const imageList = $('img').toArray()

  const promiseList = imageList.filter(el => {
    const src = $(el).attr('src')
    const pathImg = path.resolve(dir, src)

    return validImgExtensions.includes(path.extname(pathImg).toLowerCase())
  })
    .map(el => {
      const src = $(el).attr('src')
      const pathImg = path.resolve(dir, src)

      return lqipFile(pathImg, src)
    })

  Promise.all(promiseList)
    .then(resultList => {
      resultList.forEach(({ originImg, base64 }) => {
        const image = imageList.find(el => $(el).attr('src') === originImg)

        $(image).attr(attribute, base64)
      })

      fs.writeFileSync(pathHtml, $.html(), { encoding: 'utf8' })
      resolve()
    })
    .catch(error => reject(error))
})

module.exports = (config = { attribute: 'placeholder' }) => {
  const files = []

  function aggregate(file, encoding, done) {
    if (file.isStream()) {
      done(new PluginError(PLUGIN_NAME, 'Streams not supported!'))
      return
    }

    if (!validFileExtensions.includes(path.extname(file.path).toLowerCase())) {
      done(new PluginError(PLUGIN_NAME, 'Only html files are supported!'))
      return
    }

    files.push(file.path)
    done()
  }

  function transform(done) {
    const promiseFileList = files.map(filePath => processHtmlFile(filePath, config.attribute))

    Promise.all(promiseFileList)
      .then(() => done())
  }

  return through.obj(aggregate, transform)
}
