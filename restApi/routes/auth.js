var jwt = require('jsonwebtoken');
var secretKey = require('../config/secret');
var User = require('../models/user.js');
var errorHandler = require('../validators/errorHandler.js');

var auth = {


  authenticate: function(req, res, next) {
    if (!req.user) {
      errorHandler.respondWith(res, errorHandler.createError(404, 'Authentication failed, double check your credentials'));
      return;
    }
    res.json(genToken(req.user));

  },

  signup: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var expectedCalories = 0;



    if(req.user) {
      errorHandler.respondWith(res, errorHandler.createError(422, "User already exists, please select different credentials"));
      return;
    }
    var user = new User({username: username.toLowerCase(), password: password, expectedCalories: expectedCalories});

    user.save(function(err) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      req.user = user;
      next();
    });
  },

  _findUser : function(req, res, next) {
    var username = req.body.username;
    // Retrieve a user
    User.findOne({username: username.toLowerCase()}, function(err, user) {
      var error;
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }

      req.user = user;
      next();
    });
  },

  _existUser : function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    // Retrieve a user
    User.findOne({username: username.toLowerCase(), password: password}, function(err, user) {
      var error;
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }

      req.user = user;
      next();
    });
  }
}

// private method
function genToken(user) {
  var expires = expiresIn(7); // expire in 7 days
  var token = jwt.sign(user, secretKey(), { exp: expires });

  return {
    token: token,
    expires: expires,
    _id: user._id,
    username: user.username,
    expectedCalories: user.expectedCalories
  };
}

// private method
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
