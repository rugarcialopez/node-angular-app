var errorHandler = require('./errorHandler.js');
var moment = require('moment');

module.exports = function(req, res, next) {
    var timeFrom = req.query.timeFrom;
    var timeTo = req.query.timeTo;

    if(timeFrom && timeTo) {
      if(!_validTime(timeFrom) || !_validTime(timeTo)) {
        errorHandler.respondWith(res, errorHandler.createError(422, 'Invalid time. Please check the format'));
        return;
      }
      if(_isAfter(timeFrom, timeTo)) {
        errorHandler.respondWith(res, errorHandler.createError(422, 'Range of dates is invalid'));
        return;
      }
    }

    if(timeFrom && !_validTime(timeFrom)) {
      errorHandler.respondWith(res, errorHandler.createError(422, 'Invalid time. Please check the format'));
      return;
    }

    if(timeTo && !_validTime(timeTo)) {
      errorHandler.respondWith(res, errorHandler.createError(422, 'Invalid time. Please check the format'));
      return;
    }

    next(); //Move to next middleware
}

var _validTime = function(time) {
  var re = /^([01]?[0-9]|2[0-3]):?([0-5]\d)$/;
  return re.test(time);
}

var _isAfter = function(timeFrom, timeTo) {
  var hourFrom = timeFrom.split(":")[0];
  var minutesFrom = timeFrom.split(":")[1];
  var dateFrom = moment().hour(hourFrom).minute(minutesFrom);

  var hourTo = timeTo.split(":")[0];
  var minutesTo = timeTo.split(":")[1];
  var dateTo = moment().hour(hourTo).minute(minutesTo);

  return dateFrom.isAfter(dateTo);
}
