const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

// DEV


// ROUTES
const indexRoute = require('../routes/index');
const aboutRoute = require('../routes/about');


class Server {
    constructor(portNumber) {
        this.app = express();
        this.init();
        this.PORT = process.env.PORT || portNumber;
    }

    init() {
        this.app.set('view engine', 'hbs');
        this.app.set('views', path.resolve(__dirname, '../views'));
        
        const layoutsPath = path.resolve(__dirname, '../views/layouts');

        this.app.engine('hbs', handlebars({
            layoutsDir: layoutsPath,
            extname: 'hbs',
            defaultLayout: 'main',
        }));

        const publicPath = path.resolve(__dirname, '../../public');
        this.app.use(express.static(publicPath));

        this.listenToRoutes();
    }

    startServer() {
        this.app.listen(this.PORT, () => {
            console.log('Server is running on PORT', this.PORT);
        });
    }

    listenToRoutes() {
        this.app.use('/', indexRoute);
        this.app.use('/about', aboutRoute)
    }
}

module.exports = Server;