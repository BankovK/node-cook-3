const express = require('express');
const fs = require('fs');
const path = require('path');
const form = fs.readFileSync(path.join(__dirname, 'public', 'form.html'));
const qs = require('querystring');
const parse = require('fast-json-parse');

const maxData = 2 * 1024 * 1024;

const app = express();

app.use(function (req, res, next) {
    if (!['GET', 'POST'].includes(req.method)) {
        reject(405, 'Method Not Allowed', res);
        return;
    }
    next();
  })
app.get('/', (req, res) => get(res));
app.post('/', (req, res) => post(req, res));
app.listen(8080);

function get(res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(form);
}

function post(req, res) {
    if (req.headers['content-type'] !== 'application/json') {
        reject(415, 'Unsupported Media Type', res);
        return;
    }
    const size = parseInt(req.headers['content-length'], 10);
    if (isNaN(size)) {
        reject(400, 'Bad Request', res);
        return;
    }
    if (size > maxData) {
        reject(413, 'Too Large', res);
        return;
    }
    const buffer = Buffer.allocUnsafe(size);
    var pos = 0;
    req
        .on('data', (chunk) => {
            const offset = pos + chunk.length;
            if (offset > size) {
                reject(413, 'Too Large', res);
                return;
            }
            chunk.copy(buffer, pos);
            pos = offset;
        })
        .on('end', () => {
            if (pos !== size) {
                reject(400, 'Bad Request', res);
                return;
            }
            const data = buffer.toString();
            const parsed = parse(data);
            if (parsed.err) {
                reject(400, 'Bad Request', res);
                return;
            }
            console.log('User Posted: ', parsed.value);
            res.end('{"data": ' + data + "}");
        })
}

function reject(code, msg, res) {
    res.statusCode = code;
    res.end(msg);
}
