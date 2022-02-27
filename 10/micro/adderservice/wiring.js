const restify = require('restify');

module.exports = wiring

const {
    ADDERSERVICE_SERVICE_PORT
} = process.env;

function wiring(service) {
    const server = restify.createServer();

    server.get('/add/:first/:second', (req, res, next) => {
        service.add(req.params, (err, result) => {
            if (err) {
                res.send(err);
                next();
                return;
            }
            res.send(200, result);
            next();
        })
    })

    server.listen(ADDERSERVICE_SERVICE_PORT, '0.0.0.0', () => {
        console.log('%s listening at %s', server.name, server.url);
    })
}