const { Transform } = require('readable-stream');
const { stringify } = require('ndjson')

const xyz = Transform({
    objectMode: true,
    transform: ({x, y}, enc, cb) => { cb(null, { z: x + y }) }
})

xyz.pipe(stringify()).pipe(process.stdout)

xyz.write({x: 199, y: 3})

xyz.write({x: 10, y: 12})
