var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('default', ['jshint']);

gulp.task('jshint', function () {
    return gulp.src('src/interview/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});