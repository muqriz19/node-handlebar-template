const path = require('path');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const { src, dest, series, parallel, watch, task } = require('gulp');
const nodemon = require('gulp-nodemon');
const minifyCSS = require('gulp-minify-css');
const less = require('gulp-less');
const concat = require('gulp-concat');

const DISTDIR = path.resolve(__dirname, './public/dist');

function runServer(cb) {
    console.log('Running server...');

    nodemon({
        script: 'src/app.js',
        env: { 'NODE_ENV': 'development' },
        done: cb
    });
}

function reloadBrowser(cb) {
    console.log('Reloading browser...');

    browserSync.init({
        proxy: 'localhost:3030'
    });

    cb();
}

function compileStyles() {
    return new Promise((resolve, reject) => {
        console.log('LESS to CSS process...');
        // LESS to CSS
        // FIRST COMPILE LESS TO CSS
        // THEN MINIFY IT
        const pathToCSS = path.resolve(__dirname, './public/stylesheets');
        const stream = src(pathToCSS + '/**/*.less')
            .pipe(less())
            .pipe(minifyCSS())
            .pipe(dest(DISTDIR));

        stream.on('finished', function () {
            resolve();
        });

        resolve();
    });
}

function compileJS() {
    return new Promise((resolve, reject) => {
        console.log('Compiling JS...');
        const pathToCSS = path.resolve(__dirname, './public/scripts');
        const stream = src(pathToCSS + '/**/*.js')
            .pipe(concat('main.js'))
            .pipe(dest(DISTDIR));

        stream.on('finished', function () {
            resolve();
        });

        resolve();
    });
}

function watchFiles() {
    return new Promise((resolve, reject) => {
        watch([
            __dirname + '/**/*js',
            './public/**/*.less',
            './src/views/**/*.hbs'
        ],
            function (cb) {
                compileStyles();
                compileJS();
                reload();
                cb();
            }).on('change', function (change) {
                const ext = change.split('.')[1];
                const file = change.split('.')[0].split('/')[change.split('.')[0].split('/').length - 1];
                const filename = file + '.' + ext;

                console.log(filename, 'was changed...');
            });
        resolve();
    });
}

task('default', parallel(runServer, series(compileStyles, compileJS, reloadBrowser, watchFiles)));