const gulp = require('gulp')
const gulpImgLqip = require('../index')

gulp.task('default', () => {
  gulp.src('*.html', { read: false })
    .pipe(gulpImgLqip())
})
