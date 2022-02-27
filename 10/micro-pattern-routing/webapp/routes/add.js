const { Router } = require('express');
const restify = require('restify-clients');
const net = require('net');
const nos = require('net-object-stream');
const router = Router();

const {
    ADDERSERVICE_SERVICE_HOST,
    ADDERSERVICE_SERVICE_PORT
} = process.env;

function createClient(ns, opts) {
    return createClient[ns] || (createClient[ns] = nos(net.connect(opts)));
}

router.get('/', (req, res) => {
    res.render('add', { first: 0, second: 0, result: 0 });
})

router.post('/calculate', (req, res, next) => {
    const client = createClient({
        host: ADDERSERVICE_SERVICE_HOST,
        port: ADDERSERVICE_SERVICE_PORT
    });
    const role = 'adder';
    const cmd = 'add';
    const { first, second } = req.body;
    client.once('data', (data) => {
        const { result } = data;
        res.render('add', {first, second, result});
    });
    client.write({role, cmd, first, second});
})

module.exports = router;