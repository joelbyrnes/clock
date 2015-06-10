
function strokeArc(colour, strokeStyle, x, y, radius, startRads, endRads, rotateRate) {
    var arc = new createjs.Shape();

    arc.graphics
        .beginStroke(colour)
        .setStrokeStyle(strokeStyle)
        .arc(0, 0, radius, startRads, endRads)
        .setStrokeStyle(0)
        .closePath();

    // the shape is created with a center at 0,0 then moved to its x,y so rotation will work
    arc.x = x;
    arc.y = y;
    arc.rotateRate = rotateRate;

    return arc;
}

// TODO remove
function createCell(x, y, cell) {
    var arc = new createjs.Shape();

    arc.graphics
        .beginStroke(cell.color)
        .setStrokeStyle(cell.height)
//        .arc(0, 0, cell.radius, cell.start * 2 * Math.PI, cell.end * 2 * Math.PI)
        .arc(0, 0, cell.radius + (cell.height / 2), cell.start * 2 * Math.PI, cell.end * 2 * Math.PI)
        .setStrokeStyle(0)
        .closePath();

    // the shape is created with a center at 0,0 then moved to its x,y so rotation will work
    arc.x = x;
    arc.y = y;

    arc.name = cell.name;
    arc.rotateRate = cell.rotateRate;
    arc.alpha = cell.alpha || 1.0;

    return arc;
}

// TODO remove
function addCells(container, xCenter, yCenter, cells) {
    for (var c=0; c < cells.length; c++) {
        container.addChild(createCell(xCenter, yCenter, cells[c]));
    }
}

var Circle = function (face, x, y) {
    this.face = face;
    this.xCenter = x;
    this.yCenter = y;
};

Circle.prototype.createCell = function(cell) {
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

Circle.prototype.addCell = function(cell) {
    this.face.addChild(this.createCell(cell));
};

Circle.prototype.addCells = function(cells) {
    for (var c=0; c < cells.length; c++) {
        this.face.addChild(this.createCell(cells[c]));
    }
};

Circle.prototype.update = function() {
//    console.log("circle updating");
    for (var i=0; i < this.face.numChildren; i++) {
        var child = this.face.getChildAt(i);
        child.rotation += child.rotateRate;
    }
};


// TODO layered circle, becomes Clock

var LayeredCircle = function (face, x, y, maxRadius) {
    Circle.call(this, face, x, y);
    this.maxRadius = maxRadius;
};

LayeredCircle.prototype = Object.create(Circle.prototype);
LayeredCircle.prototype.constructor = LayeredCircle;

LayeredCircle.prototype.addLayers = function(rows) {
    console.log(rows);

    var gap = Math.floor(this.maxRadius / 100);

    var height = Math.floor((this.maxRadius - ((rows.length) * gap)) / (rows.length));

    console.log(this.maxRadius);
    console.log("gap " + gap);
    console.log("height " + height);

    var cells = [];

    for (var r=0; r < rows.length; r++) {
        console.log("adding outer row " + r);
        var row = rows[r];
        var rad = (this.maxRadius - ((height + gap) * (r + 1)));

        for (var c=0; c < row.length; c++) {
            var cell = row[c];
            var h = (cell.height || 1) * height;

            var data = {name: cell.name, radius: rad, height: h, start: cell.start, end: cell.end,
                color: cell.color, alpha: cell.alpha, rotateRate:cell.rotateRate};
            cells.push(data);

            console.log("adding row " + r + ", cell " + c);
            console.log(data);
        }

    }

    this.addCells(cells);
};



var Clock = function (face, x, y, maxRadius) {
    Circle.call(this, face, x, y);
    this.maxRadius = maxRadius;
};

Clock.prototype = Object.create(Circle.prototype);
Clock.prototype.constructor = Clock;

Clock.prototype.drawTimePeriods = function(activities) {
    var gap = Math.floor(this.maxRadius / 100);
    // for now every activity has its own layer - later, merge ones that don't overlap.
    var height = Math.floor((this.maxRadius - ((activities.length) * gap)) / (activities.length));

    var timeCells = [];
    for (var i=0; i < activities.length; i++) {
        console.log("adding activity layer " + i);
        var rad = (this.maxRadius - ((height + gap) * (i + 1)));
        var cell = this.createActivityCell(rad, height, activities[i]);
        console.log(cell);
        timeCells.push(cell)
    }

    // outer ring
//            this.face.addChild(createCell(this.xCenter, this.yCenter, {name: "outer", radius:this.maxRadius-2, height: 2, start: 0, end: 1, color: "#505090"}));

    this.addCells(timeCells);
};

Clock.prototype.createActivityCell = function(rad, defaultHeight, act) {
    var h = (act.height || 1) * defaultHeight;
    // adjust the rendering so midnight is at the top
    var start = ((act.start - midnight) / millis24hour) - 0.25;
    var end =  ((act.end - midnight) / millis24hour) - 0.25;
    return {name: act.name, radius: rad, height: h, start: start, end: end, color: act.color, alpha: act.alpha, rotateRate: act.rotateRate};
};

Clock.prototype.drawTimePassedShadow = function() {
    var shadow = {name: "__shadow", start: midnight, end: moment(), color: "#000000", alpha: 0.5};
//            console.log(shadow);
    this.face.addChild(createCell(this.xCenter, this.yCenter, this.createActivityCell(10, this.maxRadius, shadow)));
};

Clock.prototype.update = function() {
    console.log("clock updating");
    this.face.removeChild(this.face.getChildByName("__shadow"));
    this.drawTimePassedShadow();
};
