
var ActivitiesLogic = function(weeklyActivities) {
    this.weeklyActivities = weeklyActivities || [];
    this.activities = [];
};

ActivitiesLogic.prototype.forWeekDay = function(day) {
    var dayActivities = [];

    for (var a=0; a < this.weeklyActivities.length; a++) {
        if (this.weeklyActivities[a].weekdays && this.weeklyActivities[a].weekdays.indexOf(day.day()) > -1) {
            var act = copy(this.weeklyActivities[a]);
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
  var dayActivities = [];

  for (var a=0; a < count; a++) {
    var act = {id:a, color: "hsl(" + Math.floor((a/count) * 360) + ", 100%, 50%)"};

    // mins in day: 1440 - 10 min periods: 144
    var startBlock = getRandomIntInclusive(0, 142);
    var endBlock = getRandomIntInclusive(startBlock, 144);

    var start = {hour: Math.floor(startBlock / 6), minute: startBlock % 6};
    var end = {hour: Math.floor(endBlock / 6), minute: endBlock % 6};

//    console.log(act, start, end);

    act.start = moment(start);
    act.end = moment(end);

    dayActivities.push(act);
  }
  return dayActivities;
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

