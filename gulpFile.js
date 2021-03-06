const { src, dest, series, parallel, watch, task } = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const minifyCSS = require('gulp-minify-css');
const less = require('gulp-less');
const path = require('path');

const browserify = require('browserify');
var source = require('vinyl-source-stream');

const babelify = require('babelify');

const clientJS = path.resolve(__dirname, './public/scripts');

const paths = {
    styles: {
        root: path.resolve(__dirname, './public/stylesheets/**/*.less')
    },
    js: {
        serverFile: 'src/app.js',
        backendJS: '',
        pagesJS: [
            'index',
            'about'
        ]

    },
    dist: {
        final: path.resolve(__dirname, './public/dist')
    },
};

const allWatchFiles = [
    __dirname + '/**/*.js',
    './public/scripts/**/*.js',
    './public/**/*.less',
    './src/views/**/*.hbs'
];

function runServer() {
    console.log('Running server...');
    return new Promise((resolve) => {
        nodemon({
            script: paths.js.serverFile,
            env: { 'NODE_ENV': 'development' },
        });

        resolve();
    });
}

function launchBrowser(cb) {
    console.log('Reloading browser...');
    return new Promise((resolve) => {
        browserSync.init({
            proxy: 'localhost:3030',
            browser: ['chromium']
        });

        resolve();
    });
}

function compileStyles() {
    console.log('LESS to CSS process...');
    // LESS to CSS
    // FIRST COMPILE LESS TO CSS
    // THEN MINIFY IT

    return new Promise((resolve, reject) => {
        console.log('LESS to CSS process...');
        // LESS to CSS
        // FIRST COMPILE LESS TO CSS
        // THEN MINIFY IT
        src(paths.styles.root)
            .pipe(less())
            .pipe(minifyCSS())
            .pipe(dest(paths.dist.final));

        resolve();
    });
}

function compileJS() {
    console.log('Compiling JS...');

    return new Promise((resolve, reject) => {
        console.log('Compiling JS...');

        paths.js.pagesJS.forEach((pageJS) => {
            browserify(clientJS + '/' + pageJS + '.js', {
                debug: true,
            }).transform(babelify.configure({
                presets: ['@babel/preset-env']
            })).bundle()
                .pipe(source(pageJS + '-dist.js'))
                .pipe(dest(paths.dist.final));
        });
        resolve();
    });
}

function watchFiles() {
    return new Promise((resolve, reject) => {
        watch(allWatchFiles,
            function () {
            }).on('change', function (change) {
                const ext = change.split('.')[1];
                const file = change.split('.')[0].split('/')[change.split('.')[0].split('/').length - 1];
                const filename = file + '.' + ext;
                compileStyles();
                compileJS();
                reload();

                console.log(filename, 'was changed...');
                resolve();
            });
    });
}

task('default', series(compileJS, compileStyles, runServer, launchBrowser, watchFiles));
