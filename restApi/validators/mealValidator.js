var moment = require('moment');
var errorHandler = require('./errorHandler.js');

module.exports = function(req, res, next) {


    var date = req.body.date;
    var time = req.body.time;
    var name = req.body.name;
    var numCalories = req.body.numCalories;
    var errors = [];

    _checkFieldsRequired(errors, date, time, name, numCalories);

    if(errors.length == 0) {

      if(!_validDate(date)) {
        errors.push(errorHandler.createError(5, 'Invalid date. Please check the format'));
      }

      if(!_validTime(time)) {
        errors.push(errorHandler.createError(6, 'Invalid time. Please check the format'));
      }

      if(!name) {
        errors.push(errorHandler.createError(7, 'Meal name is required'));
      }

      if(!_validNumber(numCalories)) {
        errors.push(errorHandler.createError(8, 'Invalid number of calories. Please select a number'));
      }
    }

    if(errors.length > 0) {
      errorHandler.respondWith(res, errorHandler.createError(422, errors));
      return;
    }

    next();//To move to next middleware
}

var _checkFieldsRequired = function(errors, date, time, name, numCalories) {
  if(!date) {
    errors.push(errorHandler.createError(1, 'Date is required'));
  }
  if(!time) {
    errors.push(errorHandler.createError(2, 'Time is required'));
  }
  if(!name) {
    errors.push(errorHandler.createError(3, 'Name is required'));
  }
  if(!numCalories) {
    errors.push(errorHandler.createError(4, 'Number of calories is required'));
  }
}

var _validTime = function(time) {
  var re = /^([01]?[0-9]|2[0-3]):?([0-5]\d)$/;
  return re.test(time);
}

var _validNumber = function(number) {
  if (number.length == 0) return false
  var re = /^\d+$/;
  return re.test(number);
};

var _validDate = function(date) {
  return moment(date, 'YYYY-MM-DD', true).isValid();
};
