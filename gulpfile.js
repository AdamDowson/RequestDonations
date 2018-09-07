'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Set the browser that you want to supoprt
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src(['./public/*.css', '!./public/*.min.css', './public/css/*.css', '!./public/css/*.min.css'], { base: "./" })
        // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        // Minify the file
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        // Output
        .pipe(gulp.dest('.'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function () {
    return gulp.src('./public/donate-main.js')
        // Minify the file
        .pipe(uglify())
        .pipe(rename({
            basename: 'donate'
        }))
        // Output
        .pipe(gulp.dest('./public'))
});

// Gulp task to minify all files
gulp.task('default', function () {
    runSequence(
        'styles',
        'scripts'
    );
});

gulp.watch('default', function () {
    runSequence(
        'styles',
        'scripts'
    );
});

gulp.task('watch', function () {
    gulp.watch('*.css', ['default']);
    gulp.watch(['*.js', './public/donate.js'], ['default']);
})