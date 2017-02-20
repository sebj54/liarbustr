var gulp = require('gulp')
var rename = require('gulp-rename')
var svgmin = require('gulp-svgmin')
var svgSymbols = require('gulp-svg-symbols')

var svgSymbolsConfig = {
    svgClassname: 'svg-master',
    templates: ['default-svg']
}

gulp.task('default', ['compile-svg'])

gulp.task('compile-svg', function()
{
    return gulp.src(['svg/*.svg', '!svg/svg-master.svg'])
    .pipe(svgmin())
    .pipe(svgSymbols(svgSymbolsConfig))
    .pipe(rename('svg-master.svg'))
    .pipe(gulp.dest('svg'))
})
