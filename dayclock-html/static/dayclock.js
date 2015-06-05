
function strokeArc(colour, style, x, y, radius, startRads, endRads, rotateRate) {
    var arc = new createjs.Shape();

    arc.graphics
        .beginStroke(colour)
        .setStrokeStyle(style)
        .arc(0, 0, radius, startRads, endRads)
        .setStrokeStyle(0)
        .closePath();

    // the shape is created with a center at 0,0 then moved to its x,y so rotation will work
    arc.x = x;
    arc.y = y;
    arc.rotateRate = rotateRate;

    return arc;
}

