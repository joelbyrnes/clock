
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


var LayeredCircle = function (x, y, maxRadius) {
    CircularGraphics.call(this, x, y);
    this.maxRadius = maxRadius;
};

LayeredCircle.prototype = Object.create(CircularGraphics.prototype);
LayeredCircle.prototype.constructor = LayeredCircle;

LayeredCircle.prototype.addLayers = function(rows) {
    console.log('drawing ' + rows.length + ' layers');
    var gap = Math.floor(this.maxRadius / 100);
    var height = Math.floor((this.maxRadius - ((rows.length) * gap)) / (rows.length));

    var cells = [];

    for (var r=0; r < rows.length; r++) {
        console.log("adding layer " + r);
        var row = rows[r];
        var rad = (this.maxRadius - ((height + gap) * (r + 1)));

        for (var c=0; c < row.length; c++) {
            var cell = row[c];
            var h = (cell.height || 1) * height;

            var data = {name: cell.name, radius: rad, height: h, start: cell.start, end: cell.end,
                color: cell.color, alpha: cell.alpha, rotateRate:cell.rotateRate};
            cells.push(data);

            console.log("adding layer " + r + ", cell " + c);
            console.log(data);
        }

    }

    this.addSectors(cells);
};


var Clock = function (x, y, maxRadius) {
    LayeredCircle.call(this, x, y);
    this.maxRadius = maxRadius;
};

Clock.prototype = Object.create(LayeredCircle.prototype);
Clock.prototype.constructor = Clock;

Clock.prototype.drawTimePeriods = function(activities) {
    // for now every activity has its own layer - later, merge ones that don't overlap.

    var layers = [];

    for (var i=0; i < activities.length; i++) {
        console.log("adding activity " + i);
        var cell = this.createActivityCell(activities[i]);
        console.log(cell);
        layers.push([cell]);
    }

    // outer ring
//            this.addChild(sectorShape(this.xCenter, this.yCenter, {name: "outer", radius:this.maxRadius-2, height: 2, start: 0, end: 1, color: "#505090"}));

    this.addLayers(layers);
};

// effectively turns times into start and end positions
Clock.prototype.createActivityCell = function(act) {
    // adjust the rendering so midnight is at the top
    var start = ((act.start - midnight) / millis24hour) - 0.25;
    var end =  ((act.end - midnight) / millis24hour) - 0.25;

    return {name: act.name, start: start, end: end, color: act.color, alpha: act.alpha, rotateRate: act.rotateRate};
};

Clock.prototype.drawTimePassedShadow = function() {
    var shadow = {name: "__shadow", start: midnight, end: moment(), color: "#000000", alpha: 0.5};
    var cell = this.createActivityCell(shadow);
    cell.height = this.maxRadius;
    cell.radius = 10;
//    console.log("shadow ");
//    console.log(cell);
    var cellShape = this.sectorShape(cell);
    this.addChild(cellShape);
};

Clock.prototype.update = function() {
    console.log("clock updating");
    this.removeChild(this.getChildByName("__shadow"));
    this.drawTimePassedShadow();
};
