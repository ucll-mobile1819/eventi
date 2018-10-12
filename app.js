var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rfr = require('rfr');

rfr.root = __dirname;

console.log('Server started on port ' + process.env.PORT);

require('./models');

var app = express();
app.use(express.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send();
});

app.use((err, req, res, next) => {
  const sendErr = obj => res.status(400).send(obj);
  if (!err) return sendErr();
  if (err instanceof Error) return sendErr({ error: err.message });
  sendErr({ error: err });
});

module.exports = app;
