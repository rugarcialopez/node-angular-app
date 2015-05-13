errorHandler = require('./errorHandler.js');
var User = require('../models/user.js');

module.exports = function(req, res, next) {

    var userId = req.params.id;

    if(userId) {

      User.findById(userId, function(err, user) {
        if(err || !user) {
          errorHandler.respondWith(res, errorHandler.createError(500, 'Unprocessable User'));
          return;
        }
        next();// To move to next middleware
      });

    } else {
      errorHandler.respondWith(res, errorHandler.createError(500, 'Unprocessable User'));
      return;
    }

}
