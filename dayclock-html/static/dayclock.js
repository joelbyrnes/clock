
function resizeStage(stage, ow, oh, keepAspectRatio) {
    // browser viewport size
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (keepAspectRatio) {
        // keep aspect ratio
        var scale = Math.min(w / ow, h / oh);
        stage.scaleX = scale;
        stage.scaleY = scale;

        // adjust canvas size
        stage.canvas.width = ow * scale;
        stage.canvas.height = oh * scale;
    } else { // scale to exact fit
        stage.scaleX = w / ow;
        stage.scaleY = h / oh;

        // adjust canvas size
        stage.canvas.width = ow * stage.scaleX;
        stage.canvas.height = oh * stage.scaleY;
    }

    // update the stage
    stage.update()
}

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

// arc from center
CircularGraphics.prototype.arcShape = function(cell) {
    var arc = new createjs.Shape();

//    arc.graphics.arc(xCenter, yCenter, 20, 0 * Math.PI, 2.2 * Math.PI, true).lineTo(xCenter, yCenter).closePath();

    arc.graphics
        .beginFill(cell.color)
        .setStrokeStyle(0)
//        .moveTo(this.xCenter, this.yCenter)
        .arc(this.xCenter, this.yCenter, cell.radius, cell.start * 2 * Math.PI, cell.end * 2 * Math.PI, false)
        .lineTo(this.xCenter, this.yCenter)
        .closePath();

    // the shape is created with a center at 0,0 then moved to its x,y so rotation will work
//    arc.x = this.xCenter;
//    arc.y = this.yCenter;

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

CircularGraphics.prototype.update = function(event) {
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

LayeredCircle.prototype.addLayers = function(rows, maxRadius, minRadius) {
    maxRadius = maxRadius || this.maxRadius;
    minRadius = minRadius || this.minRadius;

    console.log('drawing ' + rows.length + ' layers');
    var height = (maxRadius - minRadius - ((rows.length) * this.gap)) / (rows.length);

    var cells = [];

    for (var r=0; r < rows.length; r++) {
        var row = rows[r];
        var rad = (maxRadius - ((height + this.gap) * (r + 1)));

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


function midnightToday() {
    return moment().startOf('day');
}


var Clock = function (x, y, maxRadius) {
    LayeredCircle.call(this, x, y, maxRadius);
    this.minRadius = maxRadius / 4;
    this.midnight = midnightToday();
    this.millis24hour = 86400000; // 24 * 60 * 60 * 1000;
    this.bgColor = "#000000";
    this.centerColor = this.bgColor;
    this.shadowAlpha = 0.65;
    this.activities = [];
};

Clock.prototype = Object.create(LayeredCircle.prototype);
Clock.prototype.constructor = Clock;

Clock.prototype.addActivities = function(activities) {
    this.activities = this.activities.concat(activities);
};

Clock.prototype.drawTimePeriods = function(activities) {
    // for now every activity has its own layer - later, merge ones that don't overlap.

    // outer ring
    console.log("add ring");
    this.addSector({name: "__outer", radius:this.maxRadius-this.gap*3, height: this.gap * 2, start: 0, end: 1, color: "rgb(0, 255, 0)", alpha: 210});

    var layers = [];

    for (var i=0; i < activities.length; i++) {
        console.log("adding activity " + i);
        var sector = this.calculateSector(activities[i]);
        console.log(sector);
        layers.push([sector]);
    }

    this.addLayers(layers, this.maxRadius-this.gap*3);
};

// effectively turns times into start and end positions
Clock.prototype.calculateSector = function(act) {
    // lazy copy - TODO fix
    var period = JSON.parse(JSON.stringify(act));

    // adjust the rendering so midnight is at the top - rotate back by a quarter
    period.start = ((act.start - this.midnight) / this.millis24hour) - 0.25;
    period.end = ((act.end - this.midnight) / this.millis24hour) - 0.25;

    return period;
};

Clock.prototype.drawSegmentBreaks = function() {
    // break concentric circles into 24 segments
    for (var h = 0; h < 24; h++) {
//        console.log("draw hour marker " + h);
        this.drawSpoke(h / 24.0, this.bgColor);
    }

    // TODO make arcs thinner or use straight lines. minimum appears to be 0.0036.

//    this.addChild(this.arcShape({radius: this.maxRadius, start: 0, end: 0.0036, color: "red", xalpha: 0.5}));
};

Clock.prototype.drawSpoke = function(position, color) {
    this.addChild(this.arcShape({radius: this.maxRadius, start: position - 0.0018, end: position + 0.0018, color: color, xalpha: 0.5}));
};

Clock.prototype.drawTimePassedShadow = function() {
    var shadow = {name: "__shadow", start: this.midnight, end: moment(), color: "#000000", alpha: this.shadowAlpha};
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
    time.y = this.yCenter - timeSize;
    this.addChild(time);

    var date = new createjs.Text(moment().format('ddd, MMM Do'), timeSize/2 + "px Arial", "#ffffff");
    date.textAlign = "center";
    date.x = this.xCenter;
    date.y = this.yCenter + this.gap;
    this.addChild(date);
};

Clock.prototype.todayActivities = function(activities) {
    var today = [];

    for (var i=0; i < activities.length; i++) {
        var act = activities[i];
        // start of event is after midnight and before next midnight
        // TODO what about ending tomorrow, or starting yesterday ending today?
        if ((act.start >= this.midnight) &&
                (act.start < (this.midnight + this.millis24hour))) {
            today.push(act);
        }
    }

    return today;
};

Clock.prototype.update = function(event) {
    console.log("clock updating");
    // ensure midnight is set to today, so when the clock ticks over the shadow disappears
    this.midnight = midnightToday();
    this.removeAllChildren();
//    console.log(this.todayActivities(this.activities));
    this.drawTimePeriods(this.todayActivities(this.activities));
    this.drawSegmentBreaks();
    this.drawTimePassedShadow();
    this.drawTimeAndDate();
};
