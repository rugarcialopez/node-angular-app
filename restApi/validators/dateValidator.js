var errorHandler = require('./errorHandler.js');
var moment = require('moment');

module.exports = function(req, res, next) {
    var dateFrom = req.query.dateFrom;
    var dateTo = req.query.dateTo;
    if(dateFrom && dateTo) {
      if(!_validDate(dateFrom) || !_validDate(dateTo)) {
        errorHandler.respondWith(res, errorHandler.createError(422, 'Invalid dates. Please check the format'));
        return;
      }
      if(moment(dateFrom).isAfter(moment(dateTo))) {
        errorHandler.respondWith(res, errorHandler.createError(422, 'Range of dates is invalid'));
        return;
      }
    }

    if(dateFrom && !_validDate(dateFrom)) {
      errorHandler.respondWith(res, errorHandler.createError(422, 'Invalid date. Please check the format.'));
      return;
    }

    if(dateTo && !_validDate(dateTo)) {
      errorHandler.respondWith(res, errorHandler.createError(422, 'Invalid date. Please check the format'));
      return;
    }

    next(); //Move to next middleware
}

var _validDate = function(date) {
  return moment(date, 'YYYY-MM-DD', true).isValid();
};
