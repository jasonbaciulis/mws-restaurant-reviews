const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify-es').default;
const minifycss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const critical = require('critical').stream;

const reload = browserSync.reload;

const src = {
  dev: {
    html: './*.html',
    css: './css/*.css',
    js: './js/*.js',
    img: './img/'
  },
  dist: {
    html: './dist/',
    css: './dist/css/',
    js: './dist/js/',
    img: './dist/img/'
  }
};
// extract critical CSS
// purge unused CSS
// lazy load images


gulp.task('watch', () => {
  browserSync({
    port: 8080,
    injectChanges: true,
    server: {
      baseDir: './'
    }
  });

  gulp.watch([src.dev.html, src.dev.css, src.dev.js]).on('change', reload);
});

gulp.task('watch:dist', () => {
  browserSync({
    port: 8080,
    injectChanges: false,
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch([src.dist.html, src.dist.css, src.dist.js]).on('change', reload);
});


gulp.task('minify-js', () => {
  gulp.src(src.dev.js)
    .pipe(uglify())
    .pipe(gulp.dest(src.dist.js));

  gulp.src('./sw.js')
    .pipe(uglify())
    .pipe(gulp.dest(src.dist.html));
});


gulp.task('minify-css', () => {
  gulp.src(src.dev.css)
    .pipe(minifycss())
    .pipe(gulp.dest(src.dist.css));
});

gulp.task('minify-html', () => {
  gulp.src(src.dev.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(src.dist.html));
});

gulp.task('images', function () {
	return gulp.src('src/img/*.jpg')
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
			quality: 80,
			// Use progressive (interlace) scan for JPEG and PNG output
			progressive: true,
			// Strip all metadata
			withMetadata: false,
			// Do not emit the error when image is enlarged.
			errorOnEnlargement: false,
		}))
    	.pipe(gulp.dest(src.dev.img))
    	.pipe(gulp.dest(src.dist.img));
});

// Generate & Inline Critical-path CSS
gulp.task('critical', function () {
    return gulp.src(src.dev.html)
        .pipe(critical({base: 'dist/', inline: true, css: ['css/normalize.css','css/styles.css']}))
        .on('error', function(err) { log.error(err.message); })
        .pipe(gulp.dest(src.dist.html));
});

gulp.task('prod', ['minify-js', 'minify-css', 'critical', 'minify-html']);
