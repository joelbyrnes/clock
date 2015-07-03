angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, ActivitiesSvc) {

  console.log("DashCtrl");

  var stage, clock;
  var animate = true;

  function init() {
    var ow = window.innerWidth;  // alternative document.body.clientWidth
    var oh = window.innerHeight; // alternative document.body.clientHeight

    canvas = document.getElementById("clockCanvas");
    canvas.width = ow;
    canvas.height = oh;

    stage = new createjs.Stage(canvas);

//    if (window.devicePixelRatio) {
//        console.log("devicePixelRatio " + window.devicePixelRatio);
////        document.getElementById("output").innerHTML = window.devicePixelRatio;
//        // grab the width and height from canvas
//        var height = canvas.getAttribute('height');
//        var width = canvas.getAttribute('width');
//        // reset the canvas width and height with window.devicePixelRatio applied
//        canvas.setAttribute('width', Math.round(width * window.devicePixelRatio));
//        canvas.setAttribute('height', Math.round( height * window.devicePixelRatio));
//        // force the canvas back to the original size using css
//        canvas.style.width = width+"px";
//        canvas.style.height = height+"px";
//        // set CreateJS to render scaled
//        stage.scaleX = stage.scaleY = window.devicePixelRatio;
//    }

    var xCenter = ow / 2;
    var yCenter = oh / 2;
    // more accurately, distance from xy and edge?
    var maxRadius = Math.floor(Math.min(ow / 2, oh / 2));

    clock = new Clock(xCenter, yCenter, maxRadius);
    stage.addChild(clock);

//            clock.bgColor = "#222222";
    canvas.style.background = clock.bgColor;
    clock.centerColor = clock.bgColor;

    draw(clock);
//            resizeStage(stage, ow, oh, true);

    // redraw every 1s
    createjs.Ticker.setFPS(1);
    createjs.Ticker.addEventListener("tick", tick);

    stage.update();

    window.onresize = function() {
      console.log("resizing");
//                resizeStage(stage, ow, oh, true);
    }
  }

  function draw(clock) {
    // from clockdata.js

    clock.setActivitiesLogic(new ActivitiesLogic(ActivitiesSvc.all()));

    clock.update();
  }

  // zero-start months
  var increasingTime = moment({year: 2015, month: 5, day: 25}); //.startOf('day');

  function tick(event) {
    if (animate) {
      clock.update(event);
//                clock.showTime(increasingTime.add(10, 'minutes'));
    }

    stage.update(event);
  }

  init();


})

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
  var activity;
  // I'm not sure if this is a crappy hack or efficient coding.
  if ($stateParams.activityId == "new") activity = ActivitiesSvc.create();
  else activity = ActivitiesSvc.get($stateParams.activityId);
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
    ActivitiesSvc.saveOrUpdate(activity);
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

      ActivitiesSvc.saveOrUpdate(activity);
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

      ActivitiesSvc.saveOrUpdate(activity);
    }
  };
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
