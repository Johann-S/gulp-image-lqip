'use strict'

const path = require('path')
const through = require('through2')
const PluginError = require('plugin-error')
const { processHtmlFile } = require('./util')

const PLUGIN_NAME = 'gulp-image-lqip'
const validFileExtensions = ['.html']
const defaultConfig = {
  attribute: 'data-src',
  rootPath: null
}

module.exports = (rootPath, config = {}) => {
  const files = []

  config = Object.assign(defaultConfig, config)

  if (!path.isAbsolute(rootPath)) {
    throw new Error(`${PLUGIN_NAME}: rootPath must be absolute`)
  }

  config.rootPath = rootPath

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
