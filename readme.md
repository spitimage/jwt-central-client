# Introduction
Express middleware for the [jwt-central][jwtc] authentication service.

# Initialization

```js
// Initialize the jwt-central-client with the host params for the jwt-central server
jwtCentralClient.init('localhost', 8000);
```

# Authentication

```js
// Example API endpoint that shows the current decoded jwt
app.get('/api/jwt', jwtCentralClient.auth, function (req, res) {
  res.json(req.jwt);
});

```


# Installation

    npm install
    cd example
    npm install

# Running the example application
After modifying the configuration parameters in `app.js`:

    cd example
    node app.js

# Testing

    npm install -g mocha
    mocha

# Linting

    npm install -g jshint
    jshint index.js
    jshint example
    jshint test


# License
[MIT][license]

[license]: https://github.com/spitimage/jwt-central-client/blob/master/LICENSE
[jwtc]: https://github.com/spitimage/jwt-central