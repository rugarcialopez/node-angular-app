/*
This factory is responsible for contacting the login endpoint and validating
the user. And also logging out the user and signup user.
*/
myApp.factory('UserAuthFactory', ['$window', '$location', '$http', 'AuthenticationFactory',
              function($window, $location, $http, AuthenticationFactory) {
  return {
    login: function(username, password) {
      return $http.post('http://localhost:3000/api/authenticate', {
        username: username,
        password: password
      });
    },
    signup: function(username, password, expectedCalories) {
      return $http.post('http://localhost:3000/api/signup', {
        username: username,
        password: password,
        expectedCalories
      });
    },
    logout: function() {

      if (AuthenticationFactory.isLogged) {

        AuthenticationFactory.isLogged = false;
        delete AuthenticationFactory.user;

        delete $window.localStorage.token;
        delete $window.localStorage.user;

        $location.path("/login");
      }

    }
  }
}]);
