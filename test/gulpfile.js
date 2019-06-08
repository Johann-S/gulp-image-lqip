'use strict'

const gulp = require('gulp')
const gulpImgLqip = require('..')

gulp.task('default', () => {
  return gulp.src('*.html')
    .pipe(gulpImgLqip(__dirname))
})
