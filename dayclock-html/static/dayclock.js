
var CircularGraphics = function (x, y) {
    createjs.Container.call(this);
    this.xCenter = x;
    this.yCenter = y;
};

CircularGraphics.prototype = Object.create(createjs.Container.prototype);
CircularGraphics.prototype.constructor = CircularGraphics;

// ring segment, or circular sector, or annular sector, or whatever it's called
CircularGraphics.prototype.sectorShape = function(cell) {
    var arc = new createjs.Shape();

    arc.graphics
        .beginStroke(cell.color)
        .setStrokeStyle(cell.height)
//        .arc(0, 0, cell.radius, cell.start * 2 * Math.PI, cell.end * 2 * Math.PI)
        .arc(0, 0, cell.radius + (cell.height / 2), cell.start * 2 * Math.PI, cell.end * 2 * Math.PI)
        .setStrokeStyle(0)
        .closePath();

    // the shape is created with a center at 0,0 then moved to its x,y so rotation will work
    arc.x = this.xCenter;
    arc.y = this.yCenter;

    arc.name = cell.name;
    arc.rotateRate = cell.rotateRate;
    arc.alpha = cell.alpha || 1.0;

    return arc;
};

CircularGraphics.prototype.addSector = function(cell) {
    this.addChild(this.sectorShape(cell));
};

CircularGraphics.prototype.addSectors = function(cells) {
    for (var c=0; c < cells.length; c++) {
        this.addChild(this.sectorShape(cells[c]));
    }
};

CircularGraphics.prototype.update = function() {
//    console.log("circle updating");
    for (var i=0; i < this.numChildren; i++) {
        var child = this.getChildAt(i);
        child.rotation += child.rotateRate;
    }
};


var Layer = function(row) {
    this.row = row
};

Layer.prototype.maxHeight = function() {
    var maxHeight = 0;

    for (var c=0; c < this.row.length; c++) {
        var cell = this.row[c];

        if (cell.height && cell.height > maxHeight) {
            maxHeight = cell.height;
        }
    }
    return maxHeight;
};


var LayeredCircle = function (x, y, maxRadius) {
    CircularGraphics.call(this, x, y);
    this.maxRadius = maxRadius;
    this.minRadius = 0;
    this.gap = this.maxRadius / 100;
};

LayeredCircle.prototype = Object.create(CircularGraphics.prototype);
LayeredCircle.prototype.constructor = LayeredCircle;

LayeredCircle.prototype.addLayers = function(rows) {
    console.log('drawing ' + rows.length + ' layers');
    var height = (this.maxRadius - this.minRadius - ((rows.length) * this.gap)) / (rows.length);

    var cells = [];

    for (var r=0; r < rows.length; r++) {
        var row = rows[r];
        var rad = (this.maxRadius - ((height + this.gap) * (r + 1)));

        for (var c=0; c < row.length; c++) {
            var cell = row[c];
            var h = (cell.height || 1) * height;

            // lazy copy - TODO fix
            var data = JSON.parse(JSON.stringify(cell));
            data.radius = rad;
            data.height = h;
            cells.push(data);

            console.log("adding layer " + r + ", cell " + c);
            console.log(data);
        }

    }

    this.addSectors(cells);
};


function time(hour, min) {
    return moment({hour: hour, minute: min});
}


var Clock = function (x, y, maxRadius) {
    LayeredCircle.call(this, x, y, maxRadius);
    this.minRadius = maxRadius / 4;
    this.midnight = time(0,0);
    this.millis24hour = 86400000; // 24 * 60 * 60 * 1000;
    this.centerColor = "#000000";
    this.activities = [];
};

Clock.prototype = Object.create(LayeredCircle.prototype);
Clock.prototype.constructor = Clock;

Clock.prototype.setActivities = function(activities) {
    this.activities = activities;
    console.log(this.activities);
};

Clock.prototype.drawTimePeriods = function(activities) {
    // for now every activity has its own layer - later, merge ones that don't overlap.

    var layers = [];

    for (var i=0; i < activities.length; i++) {
        console.log("adding activity " + i);
        var sector = this.calculateSector(activities[i]);
        console.log(sector);
        layers.push([sector]);
    }

    // outer ring
//            this.addChild(sectorShape(this.xCenter, this.yCenter, {name: "outer", radius:this.maxRadius-2, height: 2, start: 0, end: 1, color: "#505090"}));

    this.addLayers(layers);
};

// effectively turns times into start and end positions
Clock.prototype.calculateSector = function(act) {
    // lazy copy - TODO fix
    var period = JSON.parse(JSON.stringify(act));

    // adjust the rendering so midnight is at the top
    // TODO what is the 0.25??
    period.start = ((act.start - this.midnight) / this.millis24hour) - 0.25;
    period.end = ((act.end - this.midnight) / this.millis24hour) - 0.25;

    return period;
};

Clock.prototype.drawTimePassedShadow = function() {
    var shadow = {name: "__shadow", start: this.midnight, end: moment(), color: "#000000", alpha: 0.5};
    var cell = this.calculateSector(shadow);
    cell.height = this.maxRadius - this.minRadius;
    cell.radius = this.minRadius;
    var cellShape = this.sectorShape(cell);
    this.addChild(cellShape);
};

Clock.prototype.drawTimeAndDate = function() {
    var circle = new createjs.Shape();
    circle.graphics.beginFill(this.centerColor).drawCircle(0, 0, this.minRadius);
    circle.x = this.xCenter;
    circle.y = this.yCenter;
    this.addChild(circle);

    // based on radius 200, a good size is 30px
    var timeSize = this.maxRadius / 7.5;
    var time = new createjs.Text(moment().format('H:mm'), timeSize + "px Arial", "#ffffff");
    time.textAlign = "center";
    time.x = this.xCenter;
    time.y = this.yCenter - timeSize - this.gap;
    this.addChild(time);

    var date = new createjs.Text(moment().format('ddd, MMM Do'), timeSize/2 + "px Arial", "#ffffff");
    date.textAlign = "center";
    date.x = this.xCenter;
    date.y = this.yCenter;
    this.addChild(date);
};

Clock.prototype.update = function() {
    console.log("clock updating");
    this.removeAllChildren();
    this.drawTimePeriods(this.activities);
    this.removeChild(this.getChildByName("__shadow"));
    this.drawTimePassedShadow();
    this.drawTimeAndDate();
};
