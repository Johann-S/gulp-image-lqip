const gulp = require('gulp')
const gulpImgLqip = require('..')

gulp.task('default', () => {
  return gulp.src('*.html', { read: false })
    .pipe(gulpImgLqip({
      rootPath: __dirname
    }))
})
