var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");

gulp.task('babel', () =>
    gulp.src('src/ytplayer.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'))
);

gulp.task('compress', () => {
	gulp.src('dist/ytplayer.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
});

gulp.task('build', function(callback) {
	runSequence(
		['babel'],
		['compress'],
		callback);
});
