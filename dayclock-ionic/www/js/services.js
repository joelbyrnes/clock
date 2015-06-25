angular.module('starter.services', [])

.factory('Activities', function() {
  // Might use a resource here that returns a JSON array

  var activities = [
      {id:0, name: "work",  start: {hour: 9, minute: 30},  end: {hour: 18, minute: 0},  color: "orange", weekdays: [1,2,3,4,5]},
      {id:1, name: "sleep", start: {hour: 0, minute: 0},   end: {hour: 7, minute: 30},  color: "blue", weekdays: [1,2,3,4,5]},
      {id:2, name: "hack", start: {hour: 18, minute: 0},   end: {hour: 21, minute: 0},  color: "yellow", weekdays: [1,2,3,4]},
      {id:3, name: "party", start: {hour: 18, minute: 30},   end: {hour: 22, minute: 30},  color: "red", weekdays: [5,6]},
  ];

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
    }
  };
});
