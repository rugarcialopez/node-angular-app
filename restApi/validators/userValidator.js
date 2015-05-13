var errorHandler = require('./errorHandler.js');

module.exports = function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    if(username && password) {

      if(hasBlankSpaces(username) || hasBlankSpaces(password)) {
        errorHandler.respondWith(res, errorHandler.createError(422, 'Username and Password cannot contain spaces'));
        return;
      }

      if(!isValidEmail(username)) {
        errorHandler.respondWith(res, errorHandler.createError(422, 'Invalid credentials, email is not valid'));
        return;
      }

      next();// To move to next middleware
    } else {
      errorHandler.respondWith(res, errorHandler.createError(422, 'Username and Password are required'));
      return;
    }


}

function hasBlankSpaces(text) {
  if (text.indexOf(' ') !== -1) {
    return true;
  }
  return false;
}

//private method
function isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
};
