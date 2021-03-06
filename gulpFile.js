const { src, dest, series, parallel, watch, task } = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const minifyCSS = require('gulp-minify-css');
const less = require('gulp-less');
const path = require('path');

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
            .pipe(dest(pathToCSS + '/dist'));

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

task('default', parallel(runServer, series(compileStyles, reloadBrowser, watchFiles)));