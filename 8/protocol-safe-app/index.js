const escapeHTML = require('escape-html');
const express = require('express');
const he = require('he');
const app = express();

app.get('/', (req, res) => {
    const {prev = '', handoverToken = '', lang = 'en'} = req.query;
    pretendDbQuery((err, status) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        // FIXED HERE
        const href = escapeHTML(`${prev}${handoverToken}/${lang}`);
        console.log(href);
        res.send(`
            <h1>Current Status</h1>
            <div id=stat>
                ${he.escape(status)}
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

app.listen(3000);


// node -e "require('http').createServer((req, res)  => {console.log(req.connection.remoteAddress, Buffer(req.url.split('/attack/')[1], 'base 64').toString().trim())}).listen(3001)"