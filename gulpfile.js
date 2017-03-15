var gulp = require('gulp')
var rename = require('gulp-rename')
var svgmin = require('gulp-svgmin')
var svgSymbols = require('gulp-svg-symbols')
var pleeease = require('gulp-pleeease')
var sourcemaps = require('gulp-sourcemaps')
var browserSync = require('browser-sync').create()

var svgSymbolsConfig = {
    svgClassname: 'svg-master',
    templates: ['default-svg']
}

var pleeeaseConfig = {
    sass: {
        includePaths: [
            'components',
            'css',
            'node_modules',
            'views'
        ]
    }
}

function compileSvg()
{
    return gulp.src(['svg/*.svg', '!svg/svg-master.svg'])
    .pipe(svgmin())
    .pipe(svgSymbols(svgSymbolsConfig))
    .pipe(rename('svg-master.svg'))
    .pipe(gulp.dest('svg'))
}

function compileCss()
{
    gulp.src('css/app.scss', { base: '.' })
    .pipe(sourcemaps.init())
    .pipe(pleeease(pleeeaseConfig))
    .pipe(rename('app.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
}

function server()
{
    browserSync.init({
        host: 'local.liarbustr.org',
        open: 'external',
        notify: false,
        server: './'
    })

    gulp.watch([
        'svg/**',
        '!svg/svg-master.svg'
    ]).on('change', compileSvg)

    gulp.watch([
        'css/*.scss',
        'components/*/*.scss',
        'views/*/*.scss',
    ]).on('change', compileCss)

    gulp.watch([
        'components/*/*.html',
        'components/*/*.js',
        'css/app.min.css',
        'js/**',
        'locales/**',
        'svg/svg-master.svg',
        'views/*/*.html',
        'views/*/*.js',
        'index.html'
    ]).on('change', browserSync.reload)
}

gulp.task('default', ['server'])
gulp.task('compile-svg', compileSvg)
gulp.task('compile-css', compileCss)
gulp.task('server', ['compile-css', 'compile-svg'], server)
