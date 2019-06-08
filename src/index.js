'use strict'

const path = require('path')
const through = require('through2')
const PluginError = require('plugin-error')
const { processHtml } = require('./process-html')

const PLUGIN_NAME = 'gulp-image-lqip'
const validFileExtensions = ['.html', '.htm']
const defaultConfig = {
  attribute: 'data-src',
  srcAttr: 'src'
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
      return done(new PluginError(PLUGIN_NAME, 'Streams not supported!'))
    }

    if (!validFileExtensions.includes(path.extname(file.path).toLowerCase())) {
      return done(new PluginError(PLUGIN_NAME, 'Only htm(l) files are supported!'))
    }

    files.push(file.path)
    done()
  }

  function transform(done) {
    const promiseFileList = files.map(filePath => processHtml(filePath, config))

    Promise.all(promiseFileList)
      .then(() => done())
      .catch(error => done(new PluginError(PLUGIN_NAME, error)))
  }

  return through.obj(aggregate, transform)
}
