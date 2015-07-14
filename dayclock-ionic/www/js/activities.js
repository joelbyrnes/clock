
var ActivitiesLogic = function(weeklyActivities) {
    this.weeklyActivities = weeklyActivities || [];
    this.activities = [];
};

ActivitiesLogic.prototype.forWeekDay = function(day, acts) {
    var dayActivities = [];
    var activities = acts || this.weeklyActivities;

    for (var a=0; a < activities.length; a++) {
        if (activities[a].weekdays.indexOf(day.day()) > -1) {
            var act = copy(activities[a]);
            act.start = moment(act.start);
            act.end = moment(act.end);

            if (act.end >= act.start) dayActivities.push(act);
            else console.log("activity " + act.id + " '" + act.name + "' filtered out because it starts after it ends.");
//            console.log(act);
        }

    }
    return dayActivities;
};

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

ActivitiesLogic.prototype.random = function(count) {
  var randomActs = [];

  for (var a=0; a < count; a++) {
    var act = {id:a, name: ''+a, color: "hsl(" + Math.floor((a/count) * 360) + ", 100%, 50%)", weekdays: [0,1,2,3,4,5,6]};

    // mins in day: 1440 - 10 min periods: 144
    var startBlock = getRandomIntInclusive(0, 142);
    var endBlock = getRandomIntInclusive(startBlock, 144);

    act.start = {hour: Math.floor(startBlock / 6), minute: startBlock % 6};
    act.end = {hour: Math.floor(endBlock / 6), minute: endBlock % 6};

    console.log(act, act.start, act.end);

    randomActs.push(act);
  }
  return randomActs;
};

// TODO fix this
ActivitiesLogic.prototype.todayActivities = function() {
    var today = [];

    for (var i=0; i < this.activities.length; i++) {
        var act = this.activities[i];
        // start of event is after midnight and before next midnight
        // TODO what about ending tomorrow, or starting yesterday ending today?
        if ((act.start >= this.midnight) &&
            (act.start < (this.midnight + this.millis24hour))) {
            today.push(act);
        }
    }

    return today;
};

