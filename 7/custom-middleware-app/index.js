const { join } = require('path');
const express = require('express');
const index = require('./routes/index');
const answer = require('./middleware/answer');

const app = express();
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

app.use(answer());

if (dev) {
    app.use(express.static(join(__dirname, 'public')));
}

app.use('/', index);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
