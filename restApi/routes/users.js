var User = require('../models/user.js');
var errorHandler = require('../validators/errorHandler.js');

var user = {

  getUser: function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      res.send({_id:user._id, username: user.username, expectedCalories: user.expectedCalories});
    });

  },

  update: function(req, res) {

    if (!req.body.expectedCalories) {
      req.body.expectedCalories = 0;
    }

    User.findOneAndUpdate({_id:req.params.id}, req.body, {new:true}, function (err, user) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      if(user == null) {
        errorHandler.respondWith(res, errorHandler.createError(422, "Unprocessable Entity"));
        return;
      }
      res.send({_id:user._id, username: user.username, expectedCalories: user.expectedCalories});
    });
  }

}

module.exports = user;
