var myApp = angular.module('caloriesapp', ['ngRoute', 'ngNotificationsBar','ngSanitize']);

myApp.config(['$routeProvider', '$httpProvider', 'notificationsConfigProvider',
          function($routeProvider, $httpProvider, notificationsConfigProvider) {

  // auto hide
  notificationsConfigProvider.setAutoHide(true);

  // delay before hide
  notificationsConfigProvider.setHideDelay(3000);

  // support HTML
  notificationsConfigProvider.setAcceptHTML(true);

  $httpProvider.interceptors.push('TokenInterceptor');

  $routeProvider
    .when('/', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      access: {
        requiredLogin: false
      }
    }).when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      access: {
        requiredLogin: false
      }
    }).when('/user', {
      templateUrl: 'partials/user.html',
      controller: 'UserCtrl',
      access: {
        requiredLogin: true
      }
    }).when('/meals', {
      templateUrl: 'partials/meals.html',
      controller: 'MealsCtrl',
      access: {
        requiredLogin: true
      }
    }).otherwise({
      redirectTo: '/'
    });

    // $locationProvider.html5Mode(true);
}]);



myApp.run(function($rootScope, $window, $location, AuthenticationFactory) {
  // when the page refreshes, check if the user is already logged in
  AuthenticationFactory.check();

  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.localStorage.user;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    // if the user is already logged in, take him to the meals page
    if (AuthenticationFactory.isLogged == true && $location.path() != '/user') {
      $location.path('/meals');
    }
  });
});
