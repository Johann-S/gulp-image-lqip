# gulp-image-lqip

[![Build Status](https://travis-ci.org/Johann-S/gulp-image-lqip.svg?branch=master)](https://travis-ci.org/Johann-S/gulp-image-lqip)

> Parse your HTML to find images and add a placeholder attribute to them which contains their base64 representation thanks to [lqip](https://github.com/zouhir/lqip).

## Install

```
$ npm install --save-dev gulp-image-lqip
```

## Usage

```js
const gulp = require('gulp');
const gulpImgLqip = require('gulp-image-lqip');

gulp.task('default', () => {
  return gulp.src('*.html', { read: false })
    // `gulp-image-lqip` needs filepaths so you can't have any plugins before it
    .pipe(gulpImgLqip())
})
```

## API

### gulpImgLqip(options)

#### options

Type: `Object`

##### attribute

Type: `string`<br>
Default: `placeholder`<br>

Attribute which contain the base64 representation of your image.

## Thanks

Thanks to [@zouhir](https://github.com/zouhir) for [lqip](https://github.com/zouhir/lqip) :+1:

## License

MIT © [Johann-S](https://www.johann-servoire.fr/)
