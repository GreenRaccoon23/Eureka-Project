var Q    = require('q');
var jwt  = require('jwt-simple');

var secrets = require('./secrets/secretsController.js');

exports = module.exports = {

  // Log an uncaught error and then send it to the next route,
  //   which should be 'exports.errorHandler'.
  // (The file requiring this function determines the route order.)
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  
  // Send an uncaught error message to the client.
  errorHandler: function (error, req, res, next) {
    res.status(500).send({error: error.message});
  },

  // Decode the jwt token and place the extracted data into 'req.user'.
  // Send a 'Forbidden' http response if it cannot be decoded.
  decodeToken: function (req, res, next) {
    var token = req.headers['x-access-token'];
    // Example token:
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1Njg1OWM1NGRkYzUzNGQ3NWNiZThkMmUiLCJ1c2VybmFtZSI6Im1lbWUiLCJmaXJzdG5hbWUiOiJtZW1lIiwibGFzdG5hbWUiOiJtZW1lIn0.DxQxUgTw98PS8XVr2PeAIwRFntfOtkFZ8ZgTLKFDge4
    
    // If the request does not contain a token, set req.user to null
    //   and skip to the next route.
    if( !token ) { 
      req.user = null;
      return next();
    }

    // Try to decode the token.
    try {
      try {
        // First try to use the secret for today.
        req.user = jwt.decode(token, secrets.today);
        req.makeNewToken = false;
        next();
      }
      catch(error) {
        // If today's secret did not work, use yesterday's secret.
        req.user = jwt.decode(token, secrets.yesterday);
        req.makeNewToken = true;
        next();
      }
    } catch(error) {
      // If neither secret worked, tell the client that the token is invalid.
      next(error)
    }
  }

  // decode: function (req, res, next) {
  //   var token = req.headers['x-access-token'];
  //   var user;

  //   if (!token) {
  //     return res.status(403).send(); // send forbidden if a token is not provided
  //   }

  //   try {
  //     // decode token and attach user to the request
  //     // for use inside our controllers
  //     user = jwt.decode(token, secret);
  //     req.user = user;
  //     next();
  //   } catch(error) {
  //     return next(error);
  //   }

  // }
};
