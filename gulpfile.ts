/*jshint esversion: 6 */
import del from 'del';
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import cssmin from 'gulp-cssmin';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import webpackConfig from './webpack.config';
import notifier from 'node-notifier';
import eslint from 'gulp-eslint';
import gulpTslint from 'gulp-tslint';

const jestCLI = require('jest-cli');
const browserSync = require('browser-sync').create();

const PRODUCT = JSON.parse(process.env.PROD_ENV || '0');
const tslintconfig = require('./tslint.json');
const targetPath = './build';
const exec = require('child_process').exec;

//
// copy-asserts
//
gulp.task('copy-assets', () => {
  return gulp.src(
    ['src/public/**/*', '!src/public/**/*.scss', 'src/views/**/*', 'config/**/*'], {
      base: './src'
    }
  ).pipe(gulp.dest(targetPath));
});

//
// css
//
gulp.task('css', () => {
  if (PRODUCT == 'production') {
    return gulp.src('./src/public/css/**/*.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(cssmin())
      .pipe(gulp.dest('./build/public/css'));
  } else {
    return gulp.src('./src/public/css/**/*.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(gulp.dest('./build/public/css'));
  }
});

//
// lint
//
gulp.task('lint', () => {
  return gulp.src(['src/**/*.ts', '!src/**/*.d.ts'])
    .pipe(gulpTslint(tslintconfig))
    .pipe(gulpTslint.report());
});

//
// webpack
//
gulp.task('webpack', () => {
  return gulp.src('build')
    .pipe(plumber({
      errorHandler: (error) => {
        notifier.notify({
          message: error.message,
          title: error.plugin,
          sound: 'Glass'
        });
      }
    }))
    .pipe(gulpWebpack(Object.assign({}, webpackConfig.dev, {
      watch: false,
    }), webpack))
    .pipe(gulp.dest('build/public/js'))
    .pipe(browserSync.stream());
});

//
// webpack:production
//
gulp.task('webpack:production', () => {
  return gulp.src('build')
    .pipe(plumber({
      errorHandler: (error) => {
        notifier.notify({
          message: error.message,
          title: error.plugin,
          sound: 'Glass'
        });
      }
    }))
    .pipe(gulpWebpack(Object.assign({}, webpackConfig.production, {
      watch: false,
    }), webpack))
    .pipe(gulp.dest('build/public/js'));
});

//
// Clean
//
gulp.task('clean', del.bind(null, ['.tmp', 'dist', 'build', 'coverage']));

//
// tcs
//
gulp.task('tsc', function (cb) {
  exec('node ./node_modules/typescript/bin/tsc', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
    return;
  });
});

//
// nodemon
//
gulp.task('nodemon', (callback) => {
  let called = false;

  return nodemon({
    verbose: false,
    script: './bin/www',
    delay: '2500',
    ext: 'js html css ejs ico txt pdf json',
    ignore: [
      'build/client/*',
      'build/public/*',
      'build/__test__/*',
      '*.test.ts',
      '*.test.js',
      '*.ts',
      '*.tsx',
      '*.json',
      'node_modules'
    ]
  })
    .on('start', () => {
      if (!called) {
        called = true;
        setTimeout(() => {
          browserSync.init(null, {
            proxy: 'http://localhost:3000',
            port: 7000
          });
        }, 4000);
        callback();
      }
      console.log('nodemon started.');
    })
    .on('restart', (hoge) => {
      console.log('nodemon restarting... by ' + hoge);
      // when server reboot
      setTimeout(() => {
        browserSync.reload();
      }, 3000);
    })
    .on('crash', function () {
      console.error('Application has crashed!\n');
      process.exit();
    })
    .once('quit', function () {
      console.error('Application has stopped\n');
      process.exit();
    });
});

//
// start
//
gulp.task('start', gulp.series('nodemon'));

//
// browser-reload
//
gulp.task('browser-reload', () => {
  return browserSync.reload();
});

//
// build
//
gulp.task('build', gulp.series(gulp.parallel('copy-assets', 'tsc', 'css', 'lint'), 'webpack'));

//
// rebuild
//
gulp.task('rebuild', gulp.series('clean', 'build'));

//
// build:production
//
gulp.task('build:production', gulp.series('clean', 'copy-assets', 'tsc', 'css', 'lint', 'webpack:production'));

//
// webpack:watch
//
gulp.task('webpack:watch', () => {
  return gulp.src('build')
    .pipe(gulpWebpack(Object.assign({}, webpackConfig.dev, {
      watch: true,
    }), webpack))
    .pipe(gulp.dest('build/public/js'))
    .pipe(browserSync.stream());
});

// Watchs
gulp.task('watch', (done) => {
  gulp.watch('./src/public/css/*.scss')
    .on('change', function (path) {
      gulp.src(path)
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./build/public/css'));
      console.log('File(scss) ' + path + ' was changed');
    });

  gulp.watch(
    ['./src/**', '!./src/client/**/*', '!./src/public/css/*', '!./src/**/*.test.ts'], gulp.series('tsc', 'copy-assets'))
    .on('change', function (path) {
      console.log('File(ts) ' + path + ' was changed');
    });

  gulp.watch('./src/**/*.test.ts', gulp.series('tsc', 'test'))
    .on('change', function (path) {
      console.log('File(test) ' + path + ' was changed');
    });

  gulp.watch('./build/public/css/*.css', gulp.series('browser-reload'))
    .on('change', function (path) {
      console.log('File(css) ' + path + ' was changed');
    });

  done();
});

//
// test
//
gulp.task('test', () => {
  return jestCLI.runCLI({}, [__dirname]);
});

//
// test:watch
//
gulp.task('test:watch', () => {
  return jestCLI.runCLI({
    watch: true,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  }, [__dirname]);
});

//
// test:watchall
//
gulp.task('test:ts:watchall', () => {
  return jestCLI.runCLI({
    watchAll: true,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  }, [__dirname]);
});

//
// jslint
//
gulp.task('jslint', () => {
  return gulp.src(['./src/**/*.js', './src/**/*.jsx'])
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//
// develop
//
gulp.task('develop',
  gulp.series(gulp.parallel('copy-assets', 'tsc', 'css', 'lint'),
    'watch', 'webpack', 'test', 'start', 'webpack:watch'));

//
// Default task
//
gulp.task('default', gulp.series('develop'));
