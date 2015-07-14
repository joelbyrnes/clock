
var ActivitiesLogic = function(weeklyActivities) {
    this.weeklyActivities = weeklyActivities || [];
    this.activities = [];
};

ActivitiesLogic.prototype.forWeekDay = function(day) {
    var dayActivities = [];

    for (var a=0; a < this.weeklyActivities.length; a++) {
        if (this.weeklyActivities[a].weekdays.indexOf(day.day()) > -1) {
            var act = copy(this.weeklyActivities[a]);
            act.start = moment(act.start);
            act.end = moment(act.end);

            if (act.end >= act.start) dayActivities.push(act);
            else console.log("activity " + act.name + " filtered out because it starts after it ends.");
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
    var act = {id:a, color: "hsl(" + getRandomIntInclusive(0, 360) + ", 100%, 50%)"};

    var start = { hour: getRandomIntInclusive(0, 22), minute: getRandomIntInclusive(0, 5) * 10 };
    var end = { hour: getRandomIntInclusive(start.hour, 23), minute: getRandomIntInclusive(0, 5) * 10 };

    act.start = moment(start);
    act.end = moment(end);

    dayActivities.push(act);
    console.log(act);
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

