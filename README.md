# gulp-image-lqip

[![Build Status](https://travis-ci.org/Johann-S/gulp-image-lqip.svg?branch=master)](https://travis-ci.org/Johann-S/gulp-image-lqip)

> Parses your HTML files to find images and adds a data-src attribute to them which contains their Base64 representation thanks to [lqip](https://github.com/zouhir/lqip).

## Install

```sh
npm install --save-dev gulp-image-lqip
```

## Usage

```js
const gulp = require('gulp');
const gulpImgLqip = require('gulp-image-lqip');

gulp.task('default', () => {
  return gulp.src('*.html', { read: false })
    // `gulp-image-lqip` needs filepaths
    // so you can't have any plugins before it
    .pipe(gulpImgLqip())
})
```

## API

### gulpImgLqip(options)

#### options

Type: `Object`

##### attribute

* Type: `string`
* Default: `data-src`

Attribute which will contain the Base64 representation of your image.

## Thanks

Thanks to [@zouhir](https://github.com/zouhir) for [lqip](https://github.com/zouhir/lqip) :+1:

## License

MIT © [Johann-S](https://www.johann-servoire.fr/)
