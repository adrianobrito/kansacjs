var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

var jsFiles = ["./core/smolder.js", "./core/matchers.js", "./spec/**/*.js"];

gulp.task('clean', function () {
  return gulp.src('dist/*.js', {read: false})
            .pipe(clean());
});

gulp.task('test', ['dist'] , function(){
  gulp.src("dist/smolder.js")
      .pipe(jasmine());
});

gulp.task('dist', ['clean'], function(){
  return gulp.src(jsFiles)
      .pipe(concat('smolder.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('watchTest', function(){
  gulp.watch(jsFiles, ['test']);
});
