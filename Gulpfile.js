var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var minifyCss = require('gulp-minify-css');


gulp.task('jshint', function () {
    return gulp.src('./src/interview/static/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js_daka2', function () {
    return gulp.src('./src/nishidaka/static/js/index2.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js_daka', function () {
    return gulp.src('./src/nishidaka/static/js/index.js')
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
        .pipe(minifyCss())
        .pipe(rename('video.min.css'))
        .pipe(gulp.dest('./src/interview/static/css'))
});

gulp.task('css_index', function () {
    return gulp.src(['./src/interview/static/css/base.css', './src/interview/static/css/index.css'])
        .pipe(concat('all.css'))
        .pipe(minifyCss())
        .pipe(rename('index.min.css'))
        .pipe(gulp.dest('./src/interview/static/css'))
});

gulp.task('js_index', function () {
    return gulp.src('./src/interview/static/js/index.js')
        .pipe(uglify())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('./src/interview/static/js'))
});

gulp.task('js_nishidaka2', function () {
    return gulp.src('./src/nishidaka/static/js/index2.js')
        .pipe(uglify())
        .pipe(rename('index2.min.js'))
        .pipe(gulp.dest('./src/nishidaka/static/js'))
});

gulp.task('css_nishidaka2', function () {
    return gulp.src(['./src/nishidaka/static/css/base.css', './src/nishidaka/static/css/index2.css'])
        .pipe(concat('all.css'))
        .pipe(minifyCss())
        .pipe(rename('index2.min.css'))
        .pipe(gulp.dest('./src/nishidaka/static/css'))
});

gulp.task('js_nishidaka', function () {
    return gulp.src('./src/nishidaka/static/js/index.js')
        .pipe(uglify())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('./src/nishidaka/static/js'))
});

gulp.task('css_nishidaka', function () {
    return gulp.src(['./src/nishidaka/static/css/base.css', './src/nishidaka/static/css/index.css'])
        .pipe(concat('all.css'))
        .pipe(minifyCss())
        .pipe(rename('index.min.css'))
        .pipe(gulp.dest('./src/nishidaka/static/css'))
});

gulp.task('default', ['jshint', 'js_minify', 'css_minify']);
gulp.task('index', ['jshint', 'css_index', 'js_index']);
gulp.task('nishidaka_index2', ['js_daka2', 'css_nishidaka2', 'js_nishidaka2']);
gulp.task('nishidaka_index', ['js_daka', 'css_nishidaka', 'js_nishidaka']);
gulp.task('nishidaka_index3', ['daka3_js', 'nishidaka3_css', 'nishidaka3_js']);


require("./src/zhongqiu/gulp_zhongqiu.js");
require("./src/nishidaka/gulp_nishidaka.js");

gulp.task('zhongqiu_base',['base_css']);
gulp.task('zhongqiu_me', ['me_js', 'me_css']);
gulp.task('zhongqiu_rank',['rank_css','rank_js']);
gulp.task('zhongqiu_introduce', ['introduce_js', 'introduce_css']);
gulp.task('zhongqiu_friend', ['friend_js', 'friend_css']);


gulp.task('zhongqiu', ['zhongqiu_base', 'zhongqiu_me', 'zhongqiu_rank', 'zhongqiu_introduce', 'zhongqiu_friend']);



