const { Router } = require('express');
const restify = require('restify-clients');
const router = Router();

router.get('/', (req, res) => {
    res.render('add', { first: 0, second: 0, result: 0 });
})

router.post('/calculate', (req, res, next) => {
    const client = restify.createStringClient({
        url: 'http://localhost:8080'
    });
    const { first, second } = req.body;
    client.get(`/add/${first}/${second}`, (err, svcReq, svcRes, result) => {
        if (err) {
            next(err);
            return;
        }
        res.render('add', { first, second, result });
    })
})

module.exports = router;