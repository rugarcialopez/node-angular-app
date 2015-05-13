/*
This factory is responsible for sending in the access token and the key along
with each request to the serve,
*/
myApp.factory('TokenInterceptor',['$q', '$window', function($q, $window) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.localStorage.token) {
        config.headers['Authorization'] = "Bearer " + $window.localStorage.token;
        config.headers['Content-Type'] = "application/json";
      }
      return config || $q.when(config);
    },

    response: function(response) {
      return response || $q.when(response);
    }
  }

}]);
