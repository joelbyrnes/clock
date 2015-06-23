
function time(hour, min) {
    return moment({hour: hour, minute: min});
}

var normal = [
    {name: "work",  start: time(9, 30),  end: time(18, 0),  color: "orange"},
    {name: "sleep", start: time(0, 0),   end: time(7, 30),  color: "blue"},
    {name: "foo",   start: time(16, 30), end: time(24, 30), color: "green"},
    {name: "tomorrow", start: time(42, 30), end: time(46, 30), color: "yellow"},
//    {},
//    {}
];

var test = [
    {name: "a",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "b",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "c",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "d",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "e",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "f",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "g",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "h",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "i",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
    {name: "j",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
//    {name: "k",  start: time(1, 0),  end: time(23, 0),  color: "orange"},
//    {name: "z",  start: time(1, 0),  end: time(23, 30),  color: "orange", height: 5},
];

var activities = normal;


var weeklyActivities = [
    {name: "work",  start: {hour: 9, minute: 30},  end: {hour: 18, minute: 0},  color: "orange", weekdays: [1,2,3,4,5]},
    {name: "sleep", start: {hour: 0, minute: 0},   end: {hour: 7, minute: 30},  color: "blue", weekdays: [1,2,3,4,5]},
    {name: "party", start: {hour: 18, minute: 30},   end: {hour: 22, minute: 30},  color: "blue", weekdays: [5,6]},
];

function activitiesForDate(day) {
    var dayActivities = [];

    for (var a=0; a < weeklyActivities.length; a++) {
        if (weeklyActivities[a].weekdays.indexOf(day.day()) > -1) {
            var act = copy(weeklyActivities[a]);
            act.start = moment(act.start);
            act.end = moment(act.end);
            dayActivities.push(act);
//            console.log(act);
        }

    }
    return dayActivities;
}