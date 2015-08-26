var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var csso = require('gulp-csso');

gulp.task('jshint', function () {
    return gulp.src('./src/interview/static/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js_minify', function () {
    return gulp.src(['./src/interview/static/js/services.js', './src/interview/static/js/video.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename('video.min.js'))
        .pipe(gulp.dest('./src/interview/static/js'))
});

gulp.task('css_minify', function () {
    return gulp.src(['./src/interview/static/css/base.css', './src/interview/static/css/video.css'])
        .pipe(concat('all.css'))
        .pipe(csso())
        .pipe(rename('video.min.css'))
        .pipe(gulp.dest('./src/interview/static/css'))
});

gulp.task('default', ['jshint', 'js_minify', 'css_minify']);
