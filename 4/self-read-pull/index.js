const fs = require('fs');
const rs = fs.createReadStream('./1.mp3');
var size = 0;

rs.on('readable', () => {
    var data = rs.read();

    while (data !== null) {
        console.log('New chunk', data);
        data = rs.read();
    }
});

rs.on('end', () => console.log('No more data'));