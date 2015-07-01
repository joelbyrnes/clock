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
    Activities.save();
  };

  // TODO fix timezone thing - epoch wants offset from UTC
//  $scope.slots = {epochTime: moment().startOf('day').utc().add(activity.start.hour, 'hours').add(activity.start.minute, 'minutes'), format: 24, step: 5};
//  $scope.slots = {epochTime: moment(activity.start).add(10, 'hours'), format: 24, step: 1};
  $scope.slots = {epochTime: moment(activity.start), format: 24, step: 1};

  $scope.timePickerCallback = function (val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
      console.log(moment().startOf('day').add(val, 'seconds'));
    }
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
