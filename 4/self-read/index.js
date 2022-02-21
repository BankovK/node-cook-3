const fs = require('fs');
const rs = fs.createReadStream('./1.mp3');
var size = 0;

rs.on('data', chunk => {
    size += chunk.length;
    console.log('New chunk', chunk);
});

rs.on('end', () => console.log('No more data'));