var gulp = require('gulp')
var rename = require('gulp-rename')
var svgmin = require('gulp-svgmin')
var svgSymbols = require('gulp-svg-symbols')
var browserSync = require('browser-sync').create()

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

gulp.task('server', function()
{
    browserSync.init({
        host: 'liarbustr.com',
        open: 'external',
        notify: false,
        server: './'
    })

    gulp.watch([
        'components/**',
        'css/**',
        'js/**',
        'locales/**',
        'svg/**',
        'views/**',
        'index.html'
    ]).on('change', browserSync.reload)
})
