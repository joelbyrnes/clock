
var weeklyActivities = [
    {name: "work",  start: {hour: 9, minute: 30},  end: {hour: 18, minute: 0},  color: "orange", weekdays: [1,2,3,4,5]},
    {name: "sleep", start: {hour: 0, minute: 0},   end: {hour: 7, minute: 30},  color: "blue", weekdays: [1,2,3,4,5]},
    {name: "party", start: {hour: 18, minute: 30},   end: {hour: 22, minute: 30},  color: "blue", weekdays: [5,6]},
];


var Activities = function(weeklyActivities) {
    this.weeklyActivities = weeklyActivities || [];
    this.activities = [];
};

Activities.prototype.forDate = function(day) {
    var dayActivities = [];

    for (var a=0; a < this.weeklyActivities.length; a++) {
        if (this.weeklyActivities[a].weekdays.indexOf(day.day()) > -1) {
            var act = copy(this.weeklyActivities[a]);
            act.start = moment(act.start);
            act.end = moment(act.end);
            dayActivities.push(act);
//            console.log(act);
        }

    }
    return dayActivities;
};

// TODO fix this
Activities.prototype.todayActivities = function() {
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

