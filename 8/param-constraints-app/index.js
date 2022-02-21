const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const {prev = '', handoverToken = '', lang = 'en'} = req.query;

    // FIXED HERE
    if (!validate({prev, handoverToken, lang}, req.query)) {
        res.sendStatus(422);
        return;
    }

    pretendDbQuery((err, status) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        // NOT REALLY SURE
        const href = `${prev}${handoverToken}/${lang}`;
        res.send(`
            <h1>Current Status</h1>
            <div id=stat>
                ${status}
            </div>
            <br>
            <a href="${href}"> Back to Control HQ </a>
        `)
    })
})

function pretendDbQuery(cb) {
    const status = 'ON FIRE! HELP!';
    cb(null, status);
}

function validate({prev, handoverToken, lang}, query) { var valid = Object.keys(query).length <= 3
    valid = valid && typeof lang === 'string' && lang.length === 2;
    valid = valid && typeof handoverToken === 'string' && handoverToken.length;
    valid = valid && typeof prev === 'string' && prev.length < 10;
    return valid;
}

app.listen(3000);
