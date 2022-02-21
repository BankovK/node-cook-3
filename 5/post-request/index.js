const http = require('http'); // use https for https requests

const payload = `{
    "name": "Cian O Maidin",
    "company": "nearForm"
}`

const opts = {
    method: 'POST',
    hostname: 'reqres.in',
    port: 80,
    path: '/api/users',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
}

const req = http.request(opts, (res) => {
    console.log('\n Status: ' + res.statusCode);
    process.stdout.write('  Body: ');
    res.pipe(process.stdout);
    res.on('end', () => console.log('\n'));
    res.on('error', (err) => console.error('Error: ', err));
})

req.end(payload);