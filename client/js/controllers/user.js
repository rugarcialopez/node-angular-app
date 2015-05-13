myApp.controller('UserCtrl', ['$scope', 'AuthenticationFactory', 'userService', 'notifications', 'UserAuthFactory',
  function($scope, AuthenticationFactory, userService, notifications, UserAuthFactory) {

    var userId = AuthenticationFactory.user;

    userService.getUser(userId).success(function(data) {
      $scope.user = data;
    }).error(function(data, status, headers, config) {
      showNotificationsErrors(data);
    });


    $scope.update = function() {

      var user  = {};
      user.expectedCalories = $scope.user.expectedCalories;

      userService.patchUser($scope.user._id, user).success(function (data) {
        notifications.showSuccess({message: 'Saved!!'});
      }).error(function(data, status, headers, config) {
        showNotificationsErrors(data);
      });

    };


    function showNotificationsErrors(data) {
      if (data.status = 500 && data.message == 'Unprocessable User') {
        UserAuthFactory.logout();
      }
      notifications.showError({message: data.message});
    }

  }
]);
