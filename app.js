const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uploadRouter = require('./routes/uploadRoutes');
const configRouter = require('./routes/configRoutes');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/config', configRouter);

module.exports = app;
