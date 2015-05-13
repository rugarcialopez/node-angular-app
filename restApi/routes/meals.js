var Meal = require('../models/meal.js');
var errorHandler = require('../validators/errorHandler.js');
var _= require('underscore');
var moment = require('moment');

var meals = {

  find: function(req, res) {
    var criteria = {};

    if(req.query.userId) {
      criteria = {userId: req.query.userId};
    }

    if(req.query.dateFrom && req.query.dateTo) {
      criteria['date'] = {"$gte": req.query.dateFrom};
      criteria.date["$lte"] = req.query.dateTo;
    } else {
      if(req.query.dateFrom) {
        criteria['date'] = {"$gte": req.query.dateFrom};
      }
      if(req.query.dateTo) {
        criteria['date'] = {"$lte": req.query.dateTo};
      }
    }

    if(req.query.timeFrom && req.query.timeTo) {

      criteria['time'] = {"$gte": _getTimeDate(req.query.timeFrom)};
      criteria.time["$lte"] = _getTimeDate(req.query.timeTo);
    } else {

      if(req.query.timeFrom) {
        criteria['time'] = {"$gte": _getTimeDate(req.query.timeFrom)};
      }

      if(req.query.timeTo) {
        criteria['time'] = {"$lte": _getTimeDate(req.query.timeTo)};
      }
    }

    Meal.find(criteria,
      '_id date time name numCalories userId',
      {
        sort:{
          date: 1,
          time: 1
        }
      },
      function(err, meals) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      res.send(meals);
    });

  },

  create: function(req, res) {
    var time = req.body.time;
    var hour = _getHour(time);
    var minutes = _getMinutes(time);
    var timeDate = new Date(1970, 0, 1, hour, minutes)

    var meal = new Meal({
      date: (req.body.date === '')? new Date().toString(): req.body.date,
      time: timeDate,
      name: req.body.name,
      numCalories: req.body.numCalories,
      userId: req.body.userId
    });

    meal.save(function(err) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      res.json(meal);
    });
  },

  update: function(req, res) {

    var time = req.body.time;

    req.body.time = _getTimeDate(time);

    Meal.findOneAndUpdate({_id:req.params.id}, req.body, {new:true}, function (err, meal) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      if(meal == null) {
        errorHandler.respondWith(res, errorHandler.createError(422, "Unprocessable Meal"));
        return;
      }
      res.send(meal);
    });

  },

  delete: function(req, res) {
    Meal.findOneAndRemove({_id:req.params.id}, function (err, meal) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      if(meal == null) {
        errorHandler.respondWith(res, errorHandler.createError(422, "Unprocessable Meal"));
        return;
      }

      res.send(meal);
    });

  },

  getMeal: function(req, res) {
    Meal.findById(req.params.id, function(err, meal) {
      if(err) {
        errorHandler.respondWith(res, errorHandler.createError(500, 'Internal Server error'));
        return;
      }
      res.send({_id:meal._id, date: meal.date, time: meal.time, name: meal.name,
        numCalories: meal.numCalories, userId: meal.userId});
    });
  }

};

var _getHour = function(time) {
  return parseInt(time.split(":")[0]);
}

var _getMinutes = function(time) {
  return parseInt(time.split(":")[1]);
}

var _getTimeDate = function(time) {
  var timeDate = new Date(1970, 0, 1);
  timeDate.setHours(_getHour(time));
  timeDate.setMinutes(_getMinutes(time));
  return moment(timeDate).format('YYYY-MM-DD HH:mm');
}

module.exports = meals;
