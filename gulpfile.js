const gulp = require('gulp')
const rename = require('gulp-rename')
const svgmin = require('gulp-svgmin')
const svgSymbols = require('gulp-svg-symbols')
const pleeease = require('gulp-pleeease')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()

const svgSymbolsConfig = {
    svgClassname: 'svg-master',
    templates: ['default-svg'],
}

const pleeeaseConfig = {
    sass: {
        includePaths: [
            'components',
            'css',
            'node_modules',
            'views',
        ],
    },
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
        server: './',
    })

    gulp.watch([
        'svg/**',
        '!svg/svg-master.svg',
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
        'index.html',
    ]).on('change', browserSync.reload)
}

gulp.task('default', ['server'])
gulp.task('compile-svg', compileSvg)
gulp.task('compile-css', compileCss)
gulp.task('server', ['compile-css', 'compile-svg'], server)
