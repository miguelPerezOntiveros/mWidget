var gulp = require('gulp');
var ts = require('gulp-typescript');
 
gulp.task('default', function () {
    return gulp.src('core/*.ts')
        .pipe(ts({
            noImplicitAny: true
        }))
        .pipe(gulp.dest('core'));
});