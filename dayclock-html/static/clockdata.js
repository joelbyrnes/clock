
function time(hour, min) {
    return moment({hour: hour, minute: min});
}

var normal = [
    {name: "work",  start: time(9, 30),  end: time(18, 0),  color: "orange", days: [1,2,3,4,5]},
    {name: "sleep", start: time(0, 0),   end: time(7, 30),  color: "blue", days: [1,2,3,4,5]},
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

