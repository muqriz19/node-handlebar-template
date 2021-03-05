const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home', {data: {prop: 'Goodbye World'}, title: 'Helo World'});
});

module.exports = router;