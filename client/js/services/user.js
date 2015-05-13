myApp.service('userService',['$http', function($http) {

  var urlBase = 'http://localhost:3000/api/users';

  function getUser(id) {
    return $http.get(urlBase + "/" + id);
  }


  function patchUser(id, user) {
    return $http({ method: 'PATCH', url: urlBase + "/" + id, data: angular.toJson(user)});
  }


  return {
    getUser : getUser,
    patchUser: patchUser
  }
}]);
