'use strict';

var expressJwt = require('express-jwt');
var jwtCentralServerInfo = {
  host: 'localhost',
  port: 8000
};

// Default audience
var jwtAudience = 'default';

// Default noop validation function until the public key is cached
var validateJwt = function(req, res, next){
  next(new Error('No Key Found'));
};

// Fetches and caches the public signing key from the jwt-central /key endpoint
function fetchJwtPublicKey(){
  var http = require('http');
  var options = {
    hostname: jwtCentralServerInfo.host,
    port: jwtCentralServerInfo.port,
    path: '/key',
    method: 'GET'
  };

  var req = http.request(options, function(res) {
    var publicKey = '';
    res.on('data', function (chunk) {
      publicKey += chunk;
    });
    res.on('end', function(){
      validateJwt = expressJwt({ secret: publicKey, audience: jwtAudience, userProperty: 'jwt' });
    });
  });

  req.on('error', function(e) {
    throw new Error('Error reaching JWT central server: ' + e.message);
  });

  req.end();
}

// Exported middleware function - delegate to express-jwt module
function auth(req, res, next){
  validateJwt(req, res, next);
}

module.exports = {
  init: function(host, port, audience){
    jwtCentralServerInfo.host = host || jwtCentralServerInfo.host;
    jwtCentralServerInfo.port = port || jwtCentralServerInfo.port;
    jwtAudience = audience || jwtAudience;
    fetchJwtPublicKey();
  },
  auth: auth,
  // This can be called on signature failures (in case the jwt-central server has restarted with new key)
  refresh: fetchJwtPublicKey
};

