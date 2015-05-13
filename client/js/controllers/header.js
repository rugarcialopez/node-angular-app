myApp.controller("HeaderCtrl", ['$scope','$location', 'UserAuthFactory',
  function($scope, $location, UserAuthFactory) {

    $scope.logout = function() {
      UserAuthFactory.logout();
    }

    $scope.settings = function() {
      $location.path("/user");
    }

  }
]);
