
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


