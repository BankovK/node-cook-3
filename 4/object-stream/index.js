const through = require('through2');
const ndjson = require('ndjson');

const xyz = through.obj(({x, y}, enc, cb) => {
    cb(null, {z: x + y});
})

xyz.pipe(ndjson.stringify()).pipe(process.stdout);

xyz.write({x: 199, y: 3});

xyz.write({x: 10, y: 12});
