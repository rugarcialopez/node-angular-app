/*
Factory is responsible for checking user status on client side
*/
myApp.factory('AuthenticationFactory',['$window', function($window) {
  var auth = {
    isLogged: false,
    check: function() {
      if ($window.localStorage.token && $window.localStorage.user) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
        delete this.user;
      }
    }
  }

  return auth;
}]);
