var gulp = require('gulp')
var rename = require('gulp-rename')
var svgmin = require('gulp-svgmin')
var svgSymbols = require('gulp-svg-symbols')
var browserSync = require('browser-sync').create()

var svgSymbolsConfig = {
    svgClassname: 'svg-master',
    templates: ['default-svg']
}

function compileSvg()
{
    return gulp.src(['svg/*.svg', '!svg/svg-master.svg'])
    .pipe(svgmin())
    .pipe(svgSymbols(svgSymbolsConfig))
    .pipe(rename('svg-master.svg'))
    .pipe(gulp.dest('svg'))
}


function server()
{
    browserSync.init({
        host: 'liarbustr.com',
        open: 'external',
        notify: false,
        server: './'
    })

    gulp.watch([
        'svg/**',
        '!svg/svg-master.svg'
    ]).on('change', compileSvg)

    gulp.watch([
        'components/**',
        'css/**',
        'js/**',
        'locales/**',
        'views/**',
        'svg/svg-master.svg',
        'index.html'
    ]).on('change', browserSync.reload)
}

gulp.task('default', ['server'])
gulp.task('compile-svg', compileSvg)
gulp.task('server', ['compile-svg'], server)
