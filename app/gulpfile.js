var gulp = require('gulp'),
  sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  ngAnnotate = require('gulp-ng-annotate'),
  uglify = require('gulp-uglify'),
  mainBowerFiles = require('main-bower-files'),
  inject = require('gulp-inject'),
  jsonmin = require('gulp-jsonmin'),
  imagemin = require('gulp-imagemin'),
  preprocess = require('gulp-preprocess'),
  nodemon = require('gulp-nodemon'),
  fs = require('fs'),
  vfs = require('vinyl-fs');

gulp.task('symlink', function () {
  vfs.src('storage/')
    .pipe(vfs.symlink('public/storage'));
});

var dest = 'public/';
var config = null;

gulp.task('env:dev', function () {
  config = JSON.parse(fs.readFileSync('config/env/development.json'));
});

gulp.task('env:prod', function () {
  config = JSON.parse(fs.readFileSync('config/env/production.json'));
});

gulp.task('preprocess', function() {
  gulp.src('app/index.html')
  .pipe(preprocess({context: {API_URL: config.API_URL, STORAGE_URL: config.STORAGE_URL}}))
  //.pipe(inject(gulp.src(mainBowerFiles(), {read: false}), {name: 'bower'}))
  //.pipe(inject(gulp.src(['public/scripts/*.js', 'public/styles/*.css'], {read: true})))
  .pipe(gulp.dest(dest));
});

gulp.task('sass', function () {
  gulp.src('sass/**/*.scss')
    //.pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(dest + 'styles'));
});

gulp.task('js', function () {
  gulp.src(['app/**/*.module.js','app/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + 'scripts'));
});

gulp.task('jsonmin', function () {
  gulp.src(['locales/**/*.json'])
    .pipe(jsonmin())
    .pipe(rename({ extname: '.min.json' }))
    .pipe(gulp.dest(dest + 'locales'));
});

gulp.task('imagemin', function () {
  gulp.src('images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(dest + 'images'));
});

gulp.task('vendorcss', function(){
  gulp.src(mainBowerFiles("**/*.css"))
    .pipe(concat('vendor.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dest + 'styles'));
});

gulp.task('vendorjs', function(){
  gulp.src(mainBowerFiles("**/*.js"))
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(dest + 'scripts'));
});

gulp.task('copyhtml', function () {
  gulp.src('app/**/*.html')
    .pipe(gulp.dest(dest + 'app'));
});

gulp.task('copyvendor', function () {
  gulp.src('bower_components/sails.io.js/**')
    .pipe(gulp.dest(dest + 'bower_components/sails.io.js'));
  gulp.src('bower_components/fontawesome/fonts/*')
    .pipe(gulp.dest(dest + 'fonts'));
  gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest(dest + 'fonts'));
});

gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('app/**/*.js', ['js']);
  gulp.watch('locales/**/*.json', ['jsonmin']);
  gulp.watch('images/**/*', ['imagemin']);
  gulp.watch('app/**/*.html', ['copyhtml']);
});

gulp.task('compile', ['preprocess', 'sass', 'js', 'jsonmin', 'imagemin', 'vendorjs', 'vendorcss', 'copyhtml', 'copyvendor', 'symlink']);

gulp.task('build', ['env:prod', 'compile']);

gulp.task('default', ['env:dev', 'compile', 'watch'], function () {
  nodemon({
    script: 'server.js',
    //tasks: ['env:dev', 'compile']
    //env: { 'NODE_ENV': 'development' }
  });
  // .on('start', function() {
  //   console.log('start');
  // })
  // .on('change', function() {
  //   console.log('change');
  // })
  // .on('restart', function () {
  //   console.log('restarted!');
  // });
});
