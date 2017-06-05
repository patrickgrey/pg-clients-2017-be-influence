'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const browserSync = require('browser-sync');
const inject = require('gulp-inject-string');
const del = require('del');
const wiredep = require('wiredep').stream;
const debug = require('gulp-debug');
const cache = require('gulp-cached');
const size = require('gulp-size');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const htmlReplace = require('gulp-html-replace');
const concat = require('gulp-concat');
const sass = require('gulp-sass');


///////////////////////////////
// UTILITIES
//////////////////////////////


// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}


gulp.task('clean', del.bind(null, ['.tmp', 'dist', 'docs']));
gulp.task('clean-css', del.bind(null, ['app/styles/main.css']));














///////////////////////////////
// SERVE
//////////////////////////////


// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('app/**/scripts/**/*.js')
        .pipe(cache('scripts'))
        .pipe(debug({title: 'unicorn js:'}));
});

gulp.task('sass', function () {
  return gulp.src('source/**/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(debug({title: 'unicorn sass:'}))
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('app/styles/'));
});


// process CSS files and return the stream.
gulp.task('css', ['sass'], function () {
    return gulp.src('app/**/styles/**/*.css')
        .pipe(cache('styles'))
        .pipe(debug({title: 'unicorn css:'}))
        .pipe(gulp.dest('.tmp/styles')) // Need to call gulp.dest() before stream will work.
        .pipe(browserSync.stream());
});


// cannot reload page on start up so need to watch for changes in separate function.
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});


// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/**/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['js', 'css'], function () {
  
  browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: 'app',
        routes: {
          '/bower_components': 'bower_components'
        }
      }
  });

  gulp.watch('app/**/*.html', ['js-watch']);
  gulp.watch('app/**/scripts/**/*.js', ['js-watch']);
  gulp.watch('source/**/sass/**/*.scss', ['css']);
  gulp.watch('bower.json', ['wiredep']);
});









///////////////////////////////
// BUILD COMPLEX TEMPLATE
///////////////////////////////

// What about build order?
// Sort array before mapping?

var scriptsPath = 'app';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}


gulp.task('build', ['clean'], () => {
  gulp.start('processBuild');
});


// gulp.task('processBuild', ['buildMinify', 'buildImages', 'buildCopyRest'], () => {
gulp.task('processBuild', ['buildScripts', 'buildStyles', 'buildHtml', 'buildImages', 'buildCopyRest'], () => {
  return gulp.src('docs/**/*').pipe(size({title: 'build', gzip: true}));
});


gulp.task('buildScripts', function() {
   var folders = getFolders(scriptsPath);

   var tasks = folders.map(function(folder) {
      return gulp.src([
                        path.join(scriptsPath, folder, '/**/*.js'),
                        '!app/index.html'
                        ])
        .pipe(debug({title: 'unicorn js:'}))
        .pipe(sourcemaps.init())
        .pipe(concat('dist.js'))
        .pipe(uglify())
        .pipe(rename('dist.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('docs/scripts'));
   });

   return tasks;
});

gulp.task('buildStyles', function() {
   var folders = getFolders(scriptsPath);

   var tasks = folders.map(function(folder) {
      return gulp.src([
                        path.join(scriptsPath, folder, '/**/*.css'),
                        '!app/index.html'
                        ])
        .pipe(debug({title: 'unicorn css:'}))
        .pipe(sourcemaps.init())
        .pipe(concat('dist.css'))
        .pipe(cssnano())
        .pipe(rename('dist.min.css')) 
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('docs/styles'));
   });

   return tasks;
});



gulp.task('buildHtml', () => {
  return gulp.src(
                  [
                    'app/**/*.html',
                    // '!app/index.html',
                    '!app/{clix,clix/**}',
                    '!app/{ilp,ilp/**}',
                    '!app/{MOOCDirectAccess,MOOCDirectAccess/**}'
                  ]
                )
    .pipe(debug({title: 'unicorn html:'}))
    .pipe(htmlReplace({
        'css': 'styles/dist.min.css',
        'js': 'scripts/dist.min.js'
    }))
    .pipe(inject.replace('<!-- Last build date -->', '<!-- Last Build: ' + new Date().today() + ' @' + new Date().timeNow() + ' -->'))
    .pipe(gulp.dest('docs'));
});


gulp.task('buildImages', () => {
  return gulp.src([
                    'app/**/images/**/*',
                    '!app/{clix,clix/**}',
                    '!app/{ilp,ilp/**}',
                    '!app/{MOOCDirectAccess,MOOCDirectAccess/**}'
                  ])
    .pipe(debug({title: 'unicorn images:'}))
    .pipe(imagemin({
                                progressive: true,
                                interlaced: true,
                                // don't remove IDs from SVGs, they are often used
                                // as hooks for embedding and styling
                                svgoPlugins: [{cleanupIDs: false}]
                              }))
    .pipe(gulp.dest('docs'));
});


gulp.task('buildCopyRest', () => {
  return gulp.src([
    // 'app/*',
    'app/**/*.*',
    '!app/**/*.html',
    //'!app/**/*.js',
    //'!app/**/*.css',
    '!app/**/images/**/*'
  ], {
    dot: true
  })
  .pipe(debug({title: 'unicorn buildCopyRest:'}))
  .pipe(gulp.dest('docs'));
});













///////////////////////////////
// SERVE DIST
///////////////////////////////



gulp.task('serve:dist', function () {
  
  browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: 'docs',
        routes: {
          '/clix': 'app/clix'
        }
      }
  });
  
});









///////////////////////////////
// DEFAULT
///////////////////////////////


gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
