var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');

gulp.task('nishidaka3_js', function () {
    return gulp.src(['./src/nishidaka/static/js/index3.js'])
        .pipe(uglify())
        .pipe(rename('index3.min.js'))
        .pipe(gulp.dest('./src/nishidaka/static/js/min'));
});

gulp.task('nishidaka3_css', function () {
    return gulp.src(['./src/nishidaka/static/css/index3.css'])
        .pipe(minifyCss())
        .pipe(rename('index3.min.css'))
        .pipe(gulp.dest('./src/nishidaka/static/css'));
});

gulp.task('daka3_js', function () {
    return gulp.src('./src/nishidaka/static/js/index3.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});