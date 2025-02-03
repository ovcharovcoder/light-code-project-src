const gulp = require('gulp');
const { src, dest, watch, parallel, series } = gulp;
const plugins = {
	concat: require('gulp-concat'),
	uglify: require('gulp-uglify-es').default,
	browserSync: require('browser-sync').create(),
	autoprefixer: require('gulp-autoprefixer'),
	clean: require('gulp-clean'),
	webp: require('gulp-webp'),
	imagemin: require('gulp-imagemin'),
	newer: require('gulp-newer'),
	fonter: require('gulp-fonter'),
	ttf2woff2: require('gulp-ttf2woff2'),
	include: require('gulp-file-include'),
	sourcemaps: require('gulp-sourcemaps'),
	notify: require('gulp-notify'),
	replace: require('gulp-replace'),
	plumber: require('gulp-plumber'),
	cache: require('gulp-cache'),
	if: require('gulp-if'),
	postcss: require('gulp-postcss'),
	tailwindcss: require('tailwindcss'),
	cssnano: require('cssnano'),
};

// File Paths
const paths = {
	imagesSrc: 'app/images/src/**/*.{jpg,png,svg}',
	scriptsSrc: 'app/js/*.js',
	stylesSrc: 'app/css/input.css',
	htmlSrc: 'app/pages/*.html',
	fontsSrc: 'app/fonts/src/*.*',
};

// Include pages HTML with components
function pages() {
	return src(paths.htmlSrc)
		.pipe(plugins.include({ prefix: '@@', basepath: 'app/components/' }))
		.pipe(dest('app'))
		.pipe(plugins.browserSync.stream());
}

// Fonts optimization
function fonts() {
	const srcPath = 'app/fonts/src/*.*';
	return src(srcPath)
		.pipe(plugins.fonter({ formats: ['woff'] }))
		.pipe(dest('app/fonts'))
		.pipe(src(srcPath))
		.pipe(plugins.ttf2woff2())
		.pipe(dest('app/fonts'));
}

// Optimize image files
function images() {
	return src('app/images/src/*.{jpg,png,svg}')
		.pipe(plugins.newer('app/images'))
		.pipe(plugins.if(file => file.extname !== '.svg', plugins.webp()))
		.pipe(dest('app/images'))
		.pipe(plugins.if('*.webp', src('app/images/src/*.webp')))
		.pipe(
			plugins.imagemin([
				plugins.imagemin.mozjpeg({ quality: 75, progressive: true }),
				plugins.imagemin.optipng({ optimizationLevel: 5 }),
				plugins.imagemin.svgo({
					plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest('app/images'));
}

// Scripts
function cleanScripts() {
	return src('app/js/main.min.js', { allowEmpty: true }).pipe(plugins.clean());
}

function scripts() {
	return src(['app/js/*.js', '!app/js/main.min.js'])
		.pipe(
			plugins.plumber({
				errorHandler: plugins.notify.onError('Error: <%= error.message %>'),
			})
		)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('main.min.js'))
		.pipe(plugins.if(process.env.NODE_ENV === 'production', plugins.uglify()))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(dest('app/js'))
		.pipe(plugins.browserSync.stream());
}

// Styles with Tailwind CSS
function styles() {
	return src(paths.stylesSrc)
		.pipe(
			plugins.plumber({
				errorHandler: plugins.notify.onError('Error: <%= error.message %>'),
			})
		)
		.pipe(plugins.sourcemaps.init())
		.pipe(
			plugins.postcss([
				require('tailwindcss')('./tailwind.config.js'),
				require('autoprefixer'),
				require('cssnano')({ preset: 'default' }),
			])
		)
		.pipe(plugins.concat('style.min.css'))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(dest('app/css'))
		.pipe(plugins.browserSync.stream());
}

// Continuous synchronization
function sync(done) {
	plugins.browserSync.init({
		server: { baseDir: 'app/' },
		notify: false,
		port: 3000,
		ghostMode: false,
		online: true,
	});
	done();
}

// Watching and Browsersync
function watching() {
	watch(
		[paths.stylesSrc, 'app/components/*', 'app/pages/*'],
		parallel(styles, pages)
	);
	watch(paths.scriptsSrc, scripts);
	watch(paths.imagesSrc, series(images));
	sync(() => {
		console.log('BrowserSync is running');
	});
}

// Clean
function cleanDist() {
	return src('dist', { allowEmpty: true }).pipe(plugins.clean());
}

// Build production-ready assets
function building() {
	return src(
		[
			'app/css/style.min.css',
			'app/images/*.*',
			'app/images/icons/*.*',
			'app/images/*.svg',
			'app/fonts/*.*',
			'app/js/main.min.js',
			'app/*.html',
		],
		{ base: 'app' }
	).pipe(dest('dist'));
}

exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
exports.scripts = series(cleanScripts, scripts);
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, building);
exports.default = parallel(styles, fonts, images, scripts, pages, watching);
