var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');

gulp.task('me_js', function () {
    return gulp.src(['./src/zhongqiu/static/js/me.js','./src/zhongqiu/static/js/me_service.js'])
        .pipe(concat('me.all.js'))
        .pipe(uglify())
        .pipe(rename('me.min.js'))
        .pipe(gulp.dest('./src/zhongqiu/static/js'));
});

gulp.task('me_css', function () {
    return gulp.src(['./src/zhongqiu/static/css/me.css'])
        .pipe(minifyCss())
        .pipe(rename('me.min.css'))
        .pipe(gulp.dest('./src/zhongqiu/static/css'));
});

gulp.task('rank_js', function () {
    return gulp.src('./src/zhongqiu/static/js/ranking.js')
        .pipe(uglify())
        .pipe(rename('ranking.min.js'))
        .pipe(gulp.dest('./src/zhongqiu/static/js'));
});

gulp.task('rank_css', function () {
    return gulp.src('./src/zhongqiu/static/css/rank.css')
        .pipe(minifyCss())
        .pipe(rename('rank.min.css'))
        .pipe(gulp.dest('./src/zhongqiu/static/css'));
});
gulp.task('base_css', function () {
    return gulp.src('./src/zhongqiu/static/css/base.css')
        .pipe(minifyCss())
        .pipe(rename('base.min.css'))
        .pipe(gulp.dest('./src/zhongqiu/static/css'));
});