# gulp-image-lqip

[![Build Status](https://travis-ci.org/Johann-S/gulp-image-lqip.svg?branch=master)](https://travis-ci.org/Johann-S/gulp-image-lqip)
[![dependencies Status](https://img.shields.io/david/Johann-S/gulp-image-lqip.svg)](https://david-dm.org/Johann-S/gulp-image-lqip)
[![devDependency Status](https://img.shields.io/david/dev/Johann-S/gulp-image-lqip.svg)](https://david-dm.org/Johann-S/gulp-image-lqip?type=dev)

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
    .pipe(gulpImgLqip(__dirname))
})
```

## Supported files

Currently only `['jpeg', 'jpg', 'png']` are supported due to [lqip](https://github.com/zouhir/lqip#lqipbase64filepath-string).

## API

### gulpImgLqip(rootPath, options)

#### rootPath

* Type: `string`
* **Required**

Define the rootPath of your website, it must be an **absolute** path.

#### options

Type: `Object`

##### attribute

* Type: `string`
* Default: `data-src`

Attribute which will contain the Base64 representation of your image.

##### srcAttr

* Type: `string`
* Default: `src`

Attribute which contain your image.

## Thanks

Thanks to [@zouhir](https://github.com/zouhir) for [lqip](https://github.com/zouhir/lqip) :+1:

## License

MIT © [Johann-S](https://www.johann-servoire.fr/)
