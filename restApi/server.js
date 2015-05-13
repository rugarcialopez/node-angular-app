var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes');
var mongoose = require ("mongoose");
var secretKey = require('./config/secret');
var jwt = require('express-jwt');
var errorHandler = require('./validators/errorHandler.js');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,Authorization, X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use('/api/*',jwt({ secret: secretKey()}).unless({path: ['/api/authenticate', '/api/signup']}));
//Add routes
app.use('/api', routes);

// If no route is matched, we assume 404
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    errorHandler.respondWith(res, errorHandler.createError(401, 'Invalid token'));
    return;
  }
  errorHandler.respondWith(res, errorHandler.createError(404, 'Not found'));
  next(err);
});


// Start the server
app.set('port', process.env.PORT || 3000);

app.set('mongouri', process.env.MONGOURI || 'mongodb://127.0.0.1:27017/calories');

mongoose.connect(app.get('mongouri'), function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + app.get('mongouri') + '. ' + err);
  } else {
    app.listen(app.get('port'));
    console.log('Express server listening on port ' + app.get('port'));

  }
});
