var gulp = require('gulp');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');

gulp.task('default', function () {
    return gulp.src('core/*.ts')
    	.pipe(ts({ noImplicitAny: true }))
        .pipe(gulp.dest('core'));
});

gulp.task('watch', function() {
    gulp.watch('core/*.ts', ['default']);
});