# NodeJS Handlebars Template

Simple nodejs with handlebar js as its view engine to serve site

Uses gulp to start server and watch out for changes - should reload browser if changes appear.
TBH my gulpFile is somewhat messy and unknown, dont really know if this was the proper way to set it up. But for my usecase its works as intended.
Will update more as I learn and get fimilar with it.

## Features
- nodemon
- live-reload browser
- less -> css
- minify css
- allow require use on client side
- Project (client side) will create different bundle (any js found in public/scripts/**) for different pages and store in public/dist folder, and to use them link <script src="/dist/theJSFILE"> at respective .hbs templates. Note - ensure to register the JS files in gulpFile.js of pagesJS array property without .js extension

## Instruction
gulp

`
gulp
`