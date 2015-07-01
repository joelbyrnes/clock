angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ActivitiesCtrl', function($scope, Activities) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.activities = Activities.all();
  $scope.remove = function(activity) {
    Activities.remove(activity);
  };

  $scope.momentLocaleData = moment().localeData();
})

// handle checkbox data with http://ionicframework.com/docs/api/directive/ionCheckbox/

.controller('ActivityDetailCtrl', function($scope, $stateParams, Activities) {
  var activity = Activities.get($stateParams.activityId);
  var momentLocaleData = moment().localeData();

  $scope.activity = activity;
  $scope.momentLocaleData = momentLocaleData;

  $scope.weekdaysChecked = [
    {day: 0, name:momentLocaleData._weekdays[0], checked: activity.weekdays.indexOf(0) > -1},
    {day: 1, name:momentLocaleData._weekdays[1], checked: activity.weekdays.indexOf(1) > -1},
    {day: 2, name:momentLocaleData._weekdays[2], checked: activity.weekdays.indexOf(2) > -1},
    {day: 3, name:momentLocaleData._weekdays[3], checked: activity.weekdays.indexOf(3) > -1},
    {day: 4, name:momentLocaleData._weekdays[4], checked: activity.weekdays.indexOf(4) > -1},
    {day: 5, name:momentLocaleData._weekdays[5], checked: activity.weekdays.indexOf(5) > -1},
    {day: 6, name:momentLocaleData._weekdays[6], checked: activity.weekdays.indexOf(6) > -1},
  ];

  $scope.submitClicked = function() {
//    localStorageService.set('hoursPerWeek',$scope.hoursPerWeek);
    console.log("submitClicked");
  };

  $scope.dayChanged = function(day) {
    console.log('dayChanged ', day);
    var days = [];
    for (var d=0; d<7; d++) {
      if ($scope.weekdaysChecked[d].checked) days.push(d);
    }
    activity.weekdays = days;
  };

  $scope.activityChanged = function() {
    console.log('activityChanged ');
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
