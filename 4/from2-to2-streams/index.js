const from = require('from2');
const to = require('to2');

const rs = from(() => {
    rs.push(Buffer.from('Hello, World!'));
    rs.push(null);
})

// rs.on('data', chunk => {
//     console.log(chunk.toString());
// })

const ws = to((data, enc, cb) => {
    console.log(`Data written: ${data.toString()}`);
    cb();
})

rs.pipe(ws)

