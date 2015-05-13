myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory','notifications',
  function($scope, $window, $location, UserAuthFactory, AuthenticationFactory, notifications) {

    var vm = this;

    $scope.showLogin = true;

    $scope.login = function() {

      var username = $scope.username,
        password = $scope.password;

      if (username !== undefined || password !== undefined) {
        UserAuthFactory.login(username, password).success(function(data) {

          AuthenticationFactory.isLogged = true;
          AuthenticationFactory.user = data._id;

          $window.localStorage.token = data.token;
          $window.localStorage.user = data._id; // to fetch the user details on refresh

          $location.path("/meals");

        }).error(function(data, status, headers, config) {
          notifications.showError({message: data.message});
        });
      } else {
        notifications.showError({message: 'Username and password are required'});
      }

    }

    $scope.signup = function() {

      var username = $scope.username,
        password = $scope.password,
        securepassword = $scope.securepassword,
        expectedCalories = 0;

      if (password == securepassword) {
        UserAuthFactory.signup(username, password, expectedCalories).success(function(data) {

          AuthenticationFactory.isLogged = true;
          AuthenticationFactory.user = data._id;

          $window.localStorage.token = data.token;
          $window.localStorage.user = data._id; // to fetch the user details on refresh

          $location.path("/meals");

        }).error(function(data, status, headers, config) {
          notifications.showError({message: data.message});
        });
      } else {
        notifications.showError({message: 'Passwords are not identical'});
      }
    }

  }
]);
