const http = require('http');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    if (req.method !== 'GET') return error(res, 405);
    if (req.url === '/users') return users(res);
    if (req.url === '/') return index(res);
    error(res, 404);
})