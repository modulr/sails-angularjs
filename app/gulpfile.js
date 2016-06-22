var gulp = require('gulp'),
    serverFactory = require('spa-server'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    mainBowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    jsonmin = require('gulp-jsonmin'),
    imagemin = require('gulp-imagemin'),
    preprocess = require('gulp-preprocess'),
    fs = require('fs');

var config = null;

gulp.task('env:dev', function () {
    config = JSON.parse(fs.readFileSync('config/env/development.json'));
});

gulp.task('env:prod', function () {
    config = JSON.parse(fs.readFileSync('config/env/production.json'));
});

gulp.task('webserver', function () {
    var server = serverFactory.create({
        path: '.',
        port: config.APP_PORT,
        fallback: 'public/index.html'
    });
    server.start();
});

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
    //.pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('public/styles'));
});

gulp.task('js', function () {
    gulp.src(['app/**/*.module.js','app/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('jsonmin', function () {
    gulp.src(['locales/**/*.json'])
    .pipe(jsonmin())
    .pipe(rename({ extname: '.min.json' }))
    .pipe(gulp.dest('public/locales'));
});

gulp.task('imagemin', function () {
    gulp.src('images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'));
});

gulp.task('inject', ['js', 'sass'], function() {
    gulp.src('app/index.html')
    .pipe(preprocess({context: {API_URL: config.API_URL}}))
    .pipe(inject(gulp.src(mainBowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(inject(gulp.src(['public/scripts/*.js', 'public/styles/*.css'], {read: true})))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('app/**/*.js', ['js']);
    gulp.watch('locales/**/*.json', ['jsonmin']);
    gulp.watch('images/**/*', ['imagemin']);
});

gulp.task('serve', ['env:dev', 'jsonmin', 'imagemin', 'inject', 'webserver', 'watch']);
gulp.task('serve:prod', ['env:prod', 'jsonmin', 'imagemin', 'inject', 'webserver', 'watch']);
