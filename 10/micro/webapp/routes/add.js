const { Router } = require('express');
const restify = require('restify-clients');
const { dns } = require('concordant')();
const router = Router();
var clients;

// Pre-DNS:
// ------------------------------
// const {
//     ADDERSERVICE_SERVICE_HOST,
//     ADDERSERVICE_SERVICE_PORT,
//     AUDITSERVICE_SERVICE_HOST,
//     AUDITSERVICE_SERVICE_PORT
// } = process.env;

// router.get('/', (req, res) => {
//     res.render('add', { first: 0, second: 0, result: 0 });
// })

// router.post('/calculate', (req, res, next) => {
//     const clients = {
//         adder:
//             restify.createJSONClient({
//                 url: `http://${ADDERSERVICE_SERVICE_HOST}:${ADDERSERVICE_SERVICE_PORT}`
//             }),
//         audit:
//             restify.createJSONClient({
//                 url: `http://${AUDITSERVICE_SERVICE_HOST}:${AUDITSERVICE_SERVICE_PORT}`
//             })
//     }
//     const { first, second } = req.body;
//     clients.adder.get(`/add/${first}/${second}`, (err, svcReq, svcRes, data) => {
//         if (err) {
//             next(err);
//             return;
//         }

//         const { result } = data;
//         clients.audit.post('/append', {
//             calc: first + '+' + second,
//             calcResult: result
//         }, err => {
//             if (err) console.error(err);
//         });

//         res.render('add', { first, second, result });
//     })
// })

// module.exports = router;
// ------------------------------

router.get('/', (req, res) => {
    res.render('add', { first: 0, second: 0, result: 0 });
})

router.post('/calculate', resolve, respond);

function resolve(req, res, next) {
    if (clients) {
        next();
        return;
    }
    const adderservice = `_main._tcp.adderservice.micro.svc.cluster.local`;
    const auditservice = `_main._tcp.auditservice.micro.svc.cluster.local`;
    dns.resolve(adderservice, (err, locs) => {
        if (err) {
            next(err);
            return;
        }
        const { host, port } = locs[0];
        const adder = `${host}:${port}`;
        dns.resolve(auditservice, (err, locs) => {
            if (err) {
                next(err);
                return;
            }
            const { host, port } = locs[0];
            const audit = `${host}:${port}`;
            clients = {
                adder: restify.createJSONClient({ url: `http://${adder}` }),
                audit: restify.createJSONClient({ url: `http://${audit}` })
            }
            next();
        })
    })
}

function respond(req, res, next) {
    const { first, second } = req.body;
    clients.adder.get(
        `/add/${first}/${second}`,
        (err, svcReq, svcRes, data) => {
            if (err) {
                next(err);
                return;
            }

            const { result } = data;
            clients.audit.post('/append', {
                calc: first + '+' + second,
                calcResult: result
            }, (err) => {
                if (err) console.error(err);
            })

            res.render('add', { first, second, result });
        }
    )
}

module.exports = router;
