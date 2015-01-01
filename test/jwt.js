var expect = require('chai').expect;
var nock = require('nock');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var client = require('..');

describe('JWT Validation', function () {
  var scope;
  var audience = 'customaudience';
  beforeEach(function (done) {
    scope = nock('http://localhost:8000')
      .get('/key')
      .replyWithFile(200, __dirname + '/keys/rsa-public.pem');

    client.init('localhost', 8000, audience);

    // Delay long enough for the file to be streamed locally
    setTimeout(function () {
      done();
    }, 100);
  });

  it('Should return 401 on missing auth header', function (done) {
    var req = {
      headers: {
      }
    };

    client.auth(req, null, function (err) {
      expect(scope.isDone()).to.be.ok();
      expect(err).to.exist();
      expect(err.status).to.equal(401);
      done();
    });
  });


  it('Should return 401 on malformed Token', function (done) {
    var req = {
      headers: {
        authorization: 'Bearer completenonsense'
      }
    };

    client.auth(req, null, function (err) {
      expect(scope.isDone()).to.be.ok();
      expect(err).to.exist();
      expect(err.status).to.equal(401);
      done();
    });
  });

  it('Should call next() when a valid token is presented', function (done) {
    var secret = fs.readFileSync(__dirname + '/keys/rsa-private.pem');
    var data = {sub: 'ThisIsMe', aud: audience};
    var token = jwt.sign(data, secret, { algorithm: 'RS256'});

    var req = {
      headers: {
        authorization: 'Bearer ' + token
      }
    };

    client.auth(req, null, function (err) {
      expect(scope.isDone()).to.be.ok();
      expect(err).not.to.exist();
      done();
    });
  });

  it('Should return a 401 when the token contains an invalid audience', function (done) {
    var secret = fs.readFileSync(__dirname + '/keys/rsa-private.pem');
    var data = {sub: 'ThisIsMe', aud: 'wrongaudience'};
    var token = jwt.sign(data, secret, { algorithm: 'RS256'});

    var req = {
      headers: {
        authorization: 'Bearer ' + token
      }
    };

    client.auth(req, null, function (err) {
      expect(scope.isDone()).to.be.ok();
      expect(err).to.exist();
      expect(err.status).to.equal(401);
      done();
    });
  });
});