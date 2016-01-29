var gulp = require('gulp');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var codacy = require('gulp-codacy');
var sequence = require('gulp-sequence');
var gulpIf = require('gulp-if');
var del = require('del');

gulp.task('test.instrument', function instrumentTask() {
  return gulp
    .src(['index.js'])
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
  ;
});

gulp.task('test', ['test.instrument'], function testTask() {
  return gulp
    .src(['test/**/*.test.js'])
    .pipe(mocha({
      require: ['./test/bootstrap']
    }))
    .pipe(istanbul.writeReports({
      dir: './dist/test-report'
    }))
  ;
});

gulp.task('lint', function lintTask() {
  return gulp
    .src(['index.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
  ;
});

gulp.task('codacy', function codacyTask() {
  return gulp
    .src(['dist/test-report/lcov.info'], { read: false })
    .pipe(gulpIf(!!process.env.CI, codacy({
      token: ''
    })))
  ;
});

gulp.task('clean', function cleanTask() {
  return del(['!dist/.gitignore', 'dist/**']);
});

gulp.task('default', sequence(['clean', 'lint', 'test'], 'codacy'));
