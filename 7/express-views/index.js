const { join } = require('path');
const express = require('express');
const index = require('./routes/index');

const app = express();
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

if (dev) {
    app.use(express.static(join(__dirname, 'public')));
}

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', index);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
