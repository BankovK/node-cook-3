const session = require('express-session');
const bodyParser = require('body-parser');
const { join } = require('path');
const express = require('express');
const pino = require('pino')();
const logger = require('express-pino-logger')({
    instance: pino
});
const index = require('./routes/index');
const auth = require('./routes/auth');

const app = express();
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

if (dev) {
    app.use(express.static(join(__dirname, 'public')));
}
if (!dev) app.set('trust proxy', 1);

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger);
app.use(session({
    secret: 'I like pies',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: !dev}
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', index);
app.use('/auth', auth);

app.listen(port, () => {
    pino.info(`Server listening on port ${port}`);
})
