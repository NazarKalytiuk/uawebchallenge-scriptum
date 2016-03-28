var gulp = require('gulp'),
wiredep = require('wiredep').stream,
useref = require('gulp-useref'),
gulpif = require('gulp-if'),
uglify = require('gulp-uglify'),
minifyCss = require('gulp-minify-css'),
clean = require('gulp-clean'),
sass = require("gulp-sass");
concat = require("gulp-concat"),
notify = require("gulp-notify"),
prefix = require("gulp-autoprefixer"),
csscomb = require('gulp-csscomb'),
uncss = require("gulp-uncss"),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant');

// add bower components to index.html when bower.json modify
gulp.task('bower', function () {
	gulp.src('./app/index.html')
	.pipe(wiredep({directory : "app/bower_components"}))
	.pipe(gulp.dest('./app'))
	.pipe(notify('bower done!'));
});

// compile .scss files, concat, add prefix and remove unused code
gulp.task('css', function () {
	return gulp.src('app/scss/**/*.scss')
	.pipe(concat('style.scss'))
	.pipe(sass().on('error', sass.logError))
	.pipe(prefix('last 5 version'))
	.pipe(uncss({html: ['app/index.html']}))
	.pipe(csscomb())
	.pipe(gulp.dest('app/css'));
});

// remove dist folder
gulp.task('clean', function () {
	return gulp.src('dist', {read: true})
	.pipe(clean());
});

// build project
gulp.task('build', ['img', 'fonts', 'clean'], function () {
	return gulp.src('app/*.html')
	.pipe(useref())
	// .pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', minifyCss()))
	.pipe(gulp.dest('dist'))
	.pipe(notify('build done!'));
});

// copy fonts 
gulp.task('fonts', function () {
	return gulp.src('app/fonts/*')
	.pipe(gulp.dest('dist/fonts'));
});

// compress img
gulp.task('img', () => {
	return gulp.src('app/img/*')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'));
});

// watch changes
gulp.task('watch', function () {
	gulp.watch('app/scss/*.scss', ['css']);
});