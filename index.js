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
const defaultConfig = {
  attribute: 'data-src',
  rootPath: null
}

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
  let dir

  if (config.rootPath && path.isAbsolute(config.rootPath)) {
    dir = config.rootPath
  } else {
    ({ dir } = path.parse(pathHtml))
  }

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

  let updatedContentFile = fileContent
  Promise.all(promiseList)
    .then(resultList => {
      resultList.forEach(({ originImg, base64 }) => {
        const image = imageList.find(el => $(el).attr('src') === originImg)
        const originalStrImg = $.html($(image))

        $(image).attr(config.attribute, base64)
        const updatedStrImg = $.html($(image))

        updatedContentFile = updatedContentFile.replace(originalStrImg, updatedStrImg)
      })

      fs.writeFileSync(pathHtml, updatedContentFile, { encoding: 'utf8' })
      resolve()
    })
    .catch(error => reject(error))
})

module.exports = (config = {}) => {
  const files = []

  config = Object.assign(defaultConfig, config)

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
    const promiseFileList = files.map(filePath => processHtmlFile(filePath, config))

    Promise.all(promiseFileList)
      .then(() => done())
      .catch(error => done(new PluginError(PLUGIN_NAME, error)))
  }

  return through.obj(aggregate, transform)
}
