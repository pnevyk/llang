var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    beautify = require('gulp-beautify'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    insert = require('gulp-insert'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    depsOrder = require('gulp-deps-order');

var pkg = require('./package.json'),
    banner = '/* <%= pkg.name %> <%= pkg.version %> by <%= pkg.author %> */\n',
    prepend = '(function () { \'use strict\';\n\n',
    append = '})();';

gulp.task('build', function () {
    gulp.src('src/*.js')
        .pipe(depsOrder())
        .pipe(concat('build.js', {newLine: '\n\n'}))
        .pipe(insert.wrap(prepend, append))
        .pipe(header(banner, { pkg : pkg }))
        .pipe(beautify())
        .pipe(gulp.dest('dest'))
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg }))
        .pipe(rename('build.min.js'))
        .pipe(gulp.dest('dest'))
        .on('error', gutil.log);
});

gulp.task('clean', function () {
    gulp.src('dest', {read: false})
        .pipe(clean());
});

gulp.task('lint', function () {
    gulp.src('src/*.js')
        .pipe(depsOrder())
        .pipe(concat('build.js'))
        .pipe(insert.wrap(prepend, append))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .on('error', gutil.log);
});

gulp.task('test', function () {
    gulp.src('test/*.js')
        .pipe(mocha({
            reporter : 'spec'
        }))
        .on('error', gutil.log);
});

gulp.task('watch', function () {
    gulp.watch('src/*.js', ['default']);
});

gulp.task('watch:build', function () {
    gulp.watch('src/*.js', ['clean', 'build']);
});

gulp.task('watch:test', function () {
    gulp.watch(['src/*.js', 'test/*.js'], ['test']);
});

gulp.task('default', ['clean', 'build', 'lint', 'test']);
