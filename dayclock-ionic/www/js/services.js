angular.module('starter.services', [])

.factory('Activities', function() {

  var initialActivities = [
      {id:0, name: "work",  start: {hour: 9, minute: 30},  end: {hour: 18, minute: 0},  color: "orange", weekdays: [1,2,3,4,5]},
      {id:1, name: "sleep", start: {hour: 0, minute: 0},   end: {hour: 7, minute: 30},  color: "blue", weekdays: [1,2,3,4,5]},
      {id:2, name: "hack", start: {hour: 18, minute: 0},   end: {hour: 21, minute: 0},  color: "yellow", weekdays: [1,2,3,4]},
      {id:3, name: "party", start: {hour: 18, minute: 30},   end: {hour: 22, minute: 30},  color: "red", weekdays: [5,6]},
  ];

  var saveAll = function(newActitivies) {
    console.log("saving activities");
    window.localStorage.setItem("activities", JSON.stringify(newActitivies));
    activities = newActitivies;
  };

  var activities = JSON.parse(window.localStorage.getItem("activities"));
  if (!activities) {
//    window.localStorage.setItem("activities", JSON.stringify(initialActivities));
      saveAll(initialActivities);
  }

  return {
    all: function() {
      return activities;
    },
    remove: function(activity) {
        activities.splice(activities.indexOf(activity), 1);
    },
    get: function(activityId) {
      for (var i = 0; i < activities.length; i++) {
        if (activities[i].id === parseInt(activityId)) {
          return activities[i];
        }
      }
      return null;
    },
    saveAll: function(newActitivies) {
      saveAll(newActitivies);
    }
  };
});


//myApp.controller('Profile', function($scope, $http) {
//    $http.get("https://api.example.com/profile", { params: { "api_key": "some_key_here" } })
//        .success(function(data) {
//            $scope.profile = data;
//            window.localStorage.setItem("profile", JSON.stringify(data));
//        })
//        .error(function(data) {
//            if(window.localStorage.getItem("profile") !== undefined) {
//                $scope.profile = JSON.parse(window.localStorage.getItem("profile"));
//            }
//        });
//});
