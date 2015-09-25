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

gulp.task('introduce_js', function () {
    return gulp.src('./src/zhongqiu/static/js/introduce.js')
        .pipe(uglify())
        .pipe(rename('introduce.min.js'))
        .pipe(gulp.dest('./src/zhongqiu/static/js'));
});
gulp.task('introduce_css', function () {
    return gulp.src(['./src/zhongqiu/static/css/introduce.css'])
        .pipe(minifyCss())
        .pipe(rename('introduce.min.css'))
        .pipe(gulp.dest('./src/zhongqiu/static/css'));
});

gulp.task('friend_js', function () {
    return gulp.src('./src/zhongqiu/static/js/friend.js')
        .pipe(uglify())
        .pipe(rename('friend.min.js'))
        .pipe(gulp.dest('./src/zhongqiu/static/js'));
});
gulp.task('friend_css', function () {
    return gulp.src(['./src/zhongqiu/static/css/friend.css'])
        .pipe(minifyCss())
        .pipe(rename('friend.min.css'))
        .pipe(gulp.dest('./src/zhongqiu/static/css'));
});