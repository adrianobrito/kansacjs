var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');

var jsFiles = ["./core/**/*.js", "./spec/**/*.js"];

gulp.task('testDist', function(){
  gulp.src("dist/smolder.js")
      .pipe(jasmine());
});

gulp.task('dist', function(){
  gulp.src(jsFiles)
      .pipe(concat('smolder.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('test', function(){
  gulp.run('dist', 'testDist');
});

gulp.task('watchTest', function(){
  gulp.watch(jsFiles, ['test']);
});
