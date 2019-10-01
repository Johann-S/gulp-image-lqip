# gulp-image-lqip

[![npm version](https://img.shields.io/npm/v/gulp-image-lqip.svg)](https://www.npmjs.com/package/gulp-image-lqip)
[![Build Status](https://github.com/Johann-S/gulp-image-lqip/workflows/Tests/badge.svg)](https://github.com/Johann-S/gulp-image-lqip/actions?workflow=Tests)
[![dependencies Status](https://img.shields.io/david/Johann-S/gulp-image-lqip.svg)](https://david-dm.org/Johann-S/gulp-image-lqip)
[![devDependency Status](https://img.shields.io/david/dev/Johann-S/gulp-image-lqip.svg)](https://david-dm.org/Johann-S/gulp-image-lqip?type=dev)

> Parses your HTML files to find images and adds a data-src attribute to them which contains their Base64 representation.

[Demo](https://gulp-image-lqip.netlify.com/)

## Install

```sh
npm install --save-dev gulp-image-lqip
```

## Usage

```js
const gulp = require('gulp');
const gulpImgLqip = require('gulp-image-lqip');

gulp.task('default', () => {
  return gulp.src('*.html')
    // `gulp-image-lqip` needs filepaths
    // so you can't have any plugins before it
    .pipe(gulpImgLqip(__dirname))
})
```

## Supported files

Currently `['jpeg', 'jpg', 'png', 'gif']` files are supported.

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

##### pretty

* Type: `Boolean`
* Default: `true`

Use [pretty](https://github.com/jonschlinkert/pretty) to beautify the HTML files.

##### srcAttr

* Type: `string`
* Default: `src`

Attribute which contain your image.

## Support me

If you want to thank me or support my work:

- You can become my [Patron](https://www.patreon.com/jservoire)
- Or buy me a coffee: [PayPal](https://www.paypal.me/jservoire)

## Thanks

Thanks [lqip](https://github.com/zouhir/lqip) for the inspiration :+1:

## License

MIT © [Johann-S](https://www.johann-servoire.fr/)
