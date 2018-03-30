var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('images', function () {
	return gulp.src('src/*.jpg')
		.pipe($.responsive({
			'*.jpg': [{
				width: 220,
				rename: {
					suffix: '-220px',
					extname: '.jpg',
				},
			}, {
				width: 350,
				rename: {
					suffix: '-350px',
					extname: '.jpg',
				},
			}, {
				width: 500,
				rename: {
					suffix: '-500px',
					extname: '.jpg',
				},
			}, {
				width: 650,
				rename: {
					suffix: '-650px',
					extname: '.jpg',
				},
			}, {
				width: 800,
				rename: {
					suffix: '-800px',
					extname: '.jpg',
				},
			}, {
				// webp format
				width: 220,
				rename: {
					suffix: '-220px',
					extname: '.webp',
				},
			}, {
				width: 350,
				rename: {
					suffix: '-350px',
					extname: '.webp',
				},
			}, {
				width: 500,
				rename: {
					suffix: '-500px',
					extname: '.webp',
				},
			}, {
				width: 650,
				rename: {
					suffix: '-650px',
					extname: '.webp',
				},
			}, {
				width: 800,
				rename: {
					suffix: '-800px',
					extname: '.webp',
				},
			}],
		}, {
			// Global configuration for all images
			// The output quality for JPEG, WebP and TIFF output formats
			quality: 60,
			// Use progressive (interlace) scan for JPEG and PNG output
			progressive: true,
			// Strip all metadata
			withMetadata: false,
			// Do not emit the error when image is enlarged.
			errorOnEnlargement: false,
		}))
		.pipe(gulp.dest('img'));
});


// minify CSS and JS
// extract critical CSS
// purge unused CSS
// lazy load images