'use strict'

const gulp = require('gulp')
const fs = require('fs')
const cheerio = require('cheerio')
const gulpImgLqip = require('..')

const fileList = [
  'index.html',
  'test.html'
]

const lqip = () => gulp.src('*.html').pipe(gulpImgLqip(__dirname))
const validate = () => {
  const expectedErrors = 2
  let errors = 0

  fileList.forEach(filePath => {
    const fileData = fs.readFileSync(filePath, { encoding: 'utf8' })

    const $ = cheerio.load(fileData)

    $('img').each((index, element) => {
      if (!$(element).attr('data-src')) {
        errors++
      }
    })
  })

  if (errors !== expectedErrors) {
    Promise.reject(new Error(`Some images don't have a data-src attribute (expected ${expectedErrors} got ${errors})`))

    return
  }

  return Promise.resolve()
}

gulp.task('default', gulp.series(lqip, validate))
