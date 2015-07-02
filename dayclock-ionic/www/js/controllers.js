angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ActivitiesCtrl', function($scope, ActivitiesSvc) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.activities = ActivitiesSvc.all();
  $scope.remove = function(activity) {
    ActivitiesSvc.remove(activity);
  };

  $scope.momentLocaleData = moment().localeData();
})

// handle checkbox data with http://ionicframework.com/docs/api/directive/ionCheckbox/

.controller('ActivityDetailCtrl', function($scope, $stateParams, ActivitiesSvc) {
  var activity = ActivitiesSvc.get($stateParams.activityId);
  var momentLocaleData = moment().localeData();

  $scope.activity = activity;
  $scope.momentLocaleData = momentLocaleData;

  $scope.weekdaysChecked = [];
  angular.forEach([0,1,2,3,4,5,6], function(value, key) {
    this.push({day: value, name:momentLocaleData._weekdays[value], checked: activity.weekdays.indexOf(value) > -1});
  }, $scope.weekdaysChecked);

  $scope.dayChanged = function(day) {
//    console.log('dayChanged ', day);
    var days = [];
    for (var d=0; d<7; d++) {
      if ($scope.weekdaysChecked[d].checked) days.push(d);
    }
    activity.weekdays = days;

    $scope.activityChanged();
  };

  $scope.activityChanged = function() {
//    console.log('activityChanged ');
    ActivitiesSvc.save();
  };

  $scope.startTimePicker = {epochTime: 60 * (activity.start.hour * 60 + activity.start.minute), format: 24, step: 5};
  $scope.endTimePicker = {epochTime: 60 * (activity.end.hour * 60 + activity.end.minute), format: 24, step: 5};

  $scope.startTimePickerCallback = function (val) {
    if (typeof (val) === 'undefined') {
      console.log('Start time not selected');
    } else {
      var mins = val / 60;
      var hours = Math.floor(mins / 60);
      mins = mins % 60;
      console.log(hours, mins);
      activity.start.hour = hours;
      activity.start.minute = mins;

      ActivitiesSvc.save();
    }
  };

  $scope.endTimePickerCallback = function (val) {
    if (typeof (val) === 'undefined') {
      console.log('End time not selected');
    } else {
        var mins = val / 60;
        var hours = Math.floor(mins / 60);
        mins = mins % 60;
        console.log(hours, mins);
        activity.end.hour = hours;
        activity.end.minute = mins;

        ActivitiesSvc.save();
    }
  };
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
