myApp.service('mealService',['$http', function($http) {

  var urlBase = 'http://localhost:3000/api/meals';

  function findMeals(queryString) {
    return $http.get(urlBase + "?" + queryString);
  }

  function deleteMeal(id) {
    return $http.delete(urlBase + "/" + id);
  }

  function patchMeal(id, meal) {
    return $http({ method: 'PATCH', url: urlBase + "/" + id, data: angular.toJson(meal)});
  }

  function addMeal(meal) {
    return $http({ method: 'POST', url: urlBase , data: angular.toJson(meal)});
  }

  function getMeal(id) {
    return $http.get(urlBase + "/" + id);
  }

  return {
    findMeals :findMeals,
    deleteMeal: deleteMeal,
    patchMeal: patchMeal,
    addMeal: addMeal,
    getMeal: getMeal
  }
}]);
