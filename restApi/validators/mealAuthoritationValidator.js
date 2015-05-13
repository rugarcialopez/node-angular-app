errorHandler = require('./errorHandler.js');
var User = require('../models/user.js');
var Meal = require('../models/meal.js');

module.exports = function(req, res, next) {

    var userId = req.query.userId || req.body.userId;
    if(userId) {

      _findUser(req, res, next, userId);

    } else {

      _findMeal(req, res, next);
    }

}

var _findUser = function(req, res,next,  userId) {

  User.findById(userId, function(err, user) {

    if(err || !user) {
      errorHandler.respondWith(res, errorHandler.createError(500, 'Unprocessable User'));
      return;
    }
    next();// To move to next middleware
  });
}

var _findMeal = function(req, res,next) {

  Meal.findById(req.params.id, function(err, meal) {

    if(err || !meal) {
      errorHandler.respondWith(res, errorHandler.createError(422, "Unprocessable Meal"));
      return;
    }

    _findUser(req, res, next, meal.userId);

  });
}
