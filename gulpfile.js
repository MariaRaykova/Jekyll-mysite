"use strict";

let gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	csso = require("gulp-csso"),
	size = require("gulp-size"),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	cp = require("child_process");

gulp.task("css", function() {
	return gulp.src( '_assets/scss/**/*.scss' )
		.pipe( size() )
		.pipe( sass().on('error', sass.logError) )
		.pipe( autoprefixer() ) 
		.pipe( size() )
		.pipe( csso() )
		.pipe( size() )
		.pipe( gulp.dest( './docs/css/' ) )
		.pipe( browserSync.stream({ match: '**/*.css' }) )
	;
});

// Jekyll
gulp.task("jekyll-dev", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build "], { stdio: "inherit", shell: true });
});

// Jekyll
gulp.task("jekyll-prod", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build --baseurl /Jekyll-mysite"], { stdio: "inherit", shell: true });
});

gulp.task("watch", function() {

	browserSync.init({
		server: {
            baseDir: "./docs/"
		}
	});

	gulp.watch( '_assets/scss/**/*.scss', gulp.series('css') );

	gulp.watch(
		[
			"./*.html",
			"./*.yml",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_posts/**/*.*"
		]
	).on('change', gulp.series('jekyll-dev', 'css') );

	gulp.watch( 'docs/**/*.html' ).on('change', browserSync.reload );
	gulp.watch( 'docs/**/*.js' ).on('change', browserSync.reload );
});

gulp.task("deploy", gulp.series('jekyll-prod', 'css', function() {
	return cp.spawn('git status && git commit -am "update" && git pull && git push', { stdio: "inherit", shell: true });
}));

gulp.task("default", gulp.series('jekyll-dev', 'css', 'watch'));