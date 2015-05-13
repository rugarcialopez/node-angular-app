myApp.controller('MealsCtrl', ['$scope', 'AuthenticationFactory','mealService', 'UserAuthFactory', 'notifications', 'userService',
  function($scope, AuthenticationFactory, mealService, UserAuthFactory,  notifications, userService) {

    var userId = AuthenticationFactory.user;
    var queryString = "userId=" + userId;
    $scope.expectedCalories = 0;


    userService.getUser(userId).success(function(data) {
      $scope.expectedCalories = data.expectedCalories;
    }).error(function(data, status, headers, config) {
      showNotificationsErrors(data);
    });

    findMeals(queryString);

    $scope.remove = function(parentIndex, index) {
      var mealId = $scope.days[parentIndex].meals[index]._id;

      mealService.deleteMeal(mealId).success(function(data) {
        //Update total calories
        $scope.days[parentIndex].caloriesPerDay -= $scope.days[parentIndex].meals[index].numCalories;
        //Update percentCalories
        $scope.days[parentIndex].percentCaloriesConsumed = calculatePercentBurntCaloriesPerDay($scope.days[parentIndex].caloriesPerDay);
        //Remove meal
        $scope.days[parentIndex].meals.length == 1 ? $scope.days.splice(parentIndex, 1)
          : $scope.days[parentIndex].meals.splice(index, 1);
        notifications.showSuccess({message: 'Meal removed!!'});
      }).error(function(data, status, headers, config) {
        showNotificationsErrors(data);
      });
    }

    $scope.update = function(parentIndex, meal) {
      var mealObject  = createMealObject(meal.date, meal.time, meal.name, meal.numCalories);

      mealService.patchMeal(meal._id, mealObject).success(function (data) {
        $scope.days[parentIndex].caloriesPerDay = 0
        //Update total calories
        $scope.days[parentIndex].caloriesPerDay += numberCaloriesPerDay($scope.days[parentIndex].meals);
        //Update percentCalories
        $scope.days[parentIndex].percentCaloriesConsumed = calculatePercentBurntCaloriesPerDay($scope.days[parentIndex].caloriesPerDay);

        notifications.showSuccess({message: 'Meal saved!!'});
      }).error(function(data, status, headers, config) {
        showNotificationsErrors(data);
      });
    }


    $scope.addMeal = function() {
      var userId = AuthenticationFactory.user;
      var queryString = "userId=" + userId;

      var meal = createMealObject($scope.date, $scope.time, $scope.name, $scope.numCalories);

      mealService.addMeal(meal).success(function (data) {
        findMeals(queryString);
        cleanModel();
        resetFilters();
        notifications.showSuccess({message: 'Meal saved!!'});
      }).error(function(data, status, headers, config) {
        showNotificationsErrors(data);
      });

    }

    $scope.search = function(filter) {
      var queryString = "userId=" + AuthenticationFactory.user;
      var queryObject = {};
      if(filter) {
        if(filter.dateFrom) queryObject.dateFrom = parseDate(filter.dateFrom, 'YYYY-MM-DD');
        if(filter.dateTo) queryObject.dateTo = parseDate(filter.dateTo, 'YYYY-MM-DD');
        if(filter.timeFrom) queryObject.timeFrom = parseDate(filter.timeFrom, 'HH:mm');
        if(filter.timeTo) queryObject.timeTo = parseDate(filter.timeTo, 'HH:mm');
        queryString += "&" + serialize(queryObject);
      }

      findMeals(queryString);
    }


    function findMeals(queryString) {

      mealService.findMeals(queryString).success(function(data) {
        var groupDates = _.groupBy(data, 'date');

        var uiGroupDates =[];
        _.each(groupDates, function(value, key){
          var day={};
          day.day = parseDate(key, 'MMM Do YY');
          day.caloriesPerDay = numberCaloriesPerDay(value);
          day.percentCaloriesConsumed = calculatePercentBurntCaloriesPerDay(day.caloriesPerDay);
          var meals = value.map(function(item) {
            var date = item.date;
            var time = item.time;
            item.date = new Date(date);
            item.time = new Date(time);
            return item;
          })
          day.meals = meals;
          day.meals = value;

          uiGroupDates.push(day);

        });


        $scope.days = uiGroupDates;

      }).error(function(data, status, headers, config) {
        showNotificationsErrors(data);
      });
    }


    function cleanModel() {
      $scope.name = '';
      $scope.time = '';
      $scope.date = '';
      $scope.numCalories = '';
    }

    function resetFilters() {
      $scope.filter = {};
    }

    function createMealObject(date, time, name, numCalories) {
      var meal = {};
      if (date) meal.date = parseDate(date, 'YYYY-MM-DD');
      if(time) meal.time = parseDate(time, 'HH:mm');
      meal.name = name;
      meal.numCalories = numCalories;
      meal.userId = AuthenticationFactory.user;
      return meal;
    }

    function parseDate(date, format) {
      return moment(date).format(format);
    }

    function serialize(obj) {
      var str = [],
      value,
      p;
      for (p in obj) {
        if (obj.hasOwnProperty(p) && !_.isNull(obj[p])) {
          value = obj[p];
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(value));
        }
      }
      return str.join("&");
    }

    function numberCaloriesPerDay(meals) {
      var total = meals.reduce(function(sum, meal) {
        return sum + parseInt(meal.numCalories);
      }, 0);

      return total
    }

    function calculatePercentBurntCaloriesPerDay(burntCalories) {
      var percent = (burntCalories/$scope.expectedCalories) * 100;
      return (burntCalories >= $scope.expectedCalories)
                                      ? 100 : Math.round(percent);
    }


    function showNotificationsErrors(data) {
      if (data.status = 500 && data.message == 'Unprocessable User') {
        UserAuthFactory.logout();
        notifications.showError({message: data.message});
        return;
      }
      if (data.status = 422 && data.message == 'Unprocessable Meal') {
        notifications.showError({message: 'Unprocessable meal, please search again to refresh the results'});
        return;
      }
      if(_.isArray(data.message)) {
        var messages = "<ul>";
        _.each(data.message, function(error) {
          messages += "<li>" + error.message + "</li>";
        });
        messages += "</ul>";
        notifications.showError({message: messages});
      } else {
        notifications.showError({message: data.message});
      }

    }

  }
]);
