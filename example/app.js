'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var morgan = require('morgan');
var jwtCentralClient = require('..');
var auth = jwtCentralClient.auth;
app.use(morgan('dev'));

var config = {
  ip: '0.0.0.0',
  port: 8001
};

// Initialize the jwt-central-client with the host params for the jwt-central server
jwtCentralClient.init('localhost', 8000, 'default');


// Example only - Tokens should be sent in the Authorization header rather than querystring.
function tokenToHeader(req, res, next){
  req.headers.authorization = 'Bearer ' + req.query.token;
  next();
}

// Example API endpoint that shows the current decoded jwt
app.get('/api/jwt', tokenToHeader, auth, function (req, res) {
  res.json(req.jwt);
});


// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});
