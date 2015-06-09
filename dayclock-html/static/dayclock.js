
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

function addCells(container, xCenter, yCenter, cells) {
    for (var c=0; c < cells.length; c++) {
        container.addChild(createCell(xCenter, yCenter, cells[c]));
    }
}


var Clock = function (face, x, y, maxRadius) {
    this.face = face;
    this.xCenter = x;
    this.yCenter = y;
    this.maxRadius = maxRadius;
};

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

    // TODO absorb
    addCells(this.face, this.xCenter, this.yCenter, timeCells);
};

Clock.prototype.createActivityCell = function(rad, defaultHeight, act) {
    var h = (act.height || 1) * defaultHeight;
    // adjust the rendering so midnight is at the top
    var start = ((act.start - midnight) / millis24hour) - 0.25;
    var end =  ((act.end - midnight) / millis24hour) - 0.25;
    return {name: act.name, radius: rad, height: h, start: start, end: end, color: act.color, alpha: act.alpha, rotateRate: act.rotateRate};
};

Clock.prototype.drawTimePassedShadow = function() {
    var shadow = {name: "shadow", start: midnight, end: moment(), color: "#000000", alpha: 0.5};
//            console.log(shadow);
    this.face.addChild(createCell(this.xCenter, this.yCenter, this.createActivityCell(10, this.maxRadius, shadow)));
};

Clock.prototype.update = function() {
    this.drawTimePassedShadow();
};
