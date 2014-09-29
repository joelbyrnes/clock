package com.adeptusproductions.dayclock;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;

public class ClockFace {
    private static final String TAG = "ClockFace";

    Canvas canvas;
    int centerX;
    int centerY;
    float circleSize;
    RectF faceRect;

    Paint paint = new Paint();

    public ClockFace(Canvas canvas, float size) {
        this.canvas = canvas;
        centerX = canvas.getWidth() / 2;
        centerY = canvas.getHeight() / 2;
        this.circleSize = size;
        faceRect = getCenteredSquare(circleSize);

        paint.setAntiAlias(true);
    }

    void drawCircle(float size) {
        canvas.drawCircle(centerX, centerY, size, paint);
    }

    void drawSegmentBreak(float position) {
        paint.setColor(Color.BLACK);
        canvas.drawArc(faceRect, -90 + position * 360, 0.5f, true, paint);
    }

    void drawShadow(float startAngle, float sweepAngle) {
        paint.setColor(Color.argb(200, 0, 0, 0));
        canvas.drawArc(getCenteredSquare(circleSize), startAngle, sweepAngle, true, paint);
    }

    void drawShadow(float proportion) {
        drawShadow(-90, proportion * 360);
    }

    void drawRing(float outerCircle, float innerCircle, int colour) {
        drawRingSegment(outerCircle, innerCircle, colour, 0, 360);
    }

    void drawRingSegment(float outerCircle, float innerCircle, int colour, float startAngle, float sweepAngle) {
        paint.setColor(colour);
        // take 90 because circle starts at 3 o'clock position and we want it to start at 0/12
        canvas.drawArc(getCenteredSquare(outerCircle), startAngle - 90, sweepAngle, true, paint);
        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(innerCircle), 0, 360, true, paint);
    }

    RectF getCenteredSquare(float size) {
        return getCenteredRect(size, size);
    }

    RectF getCenteredRect(float width, float height) {
        float top = (canvas.getHeight() - height) / 2;
        float left = (canvas.getWidth() - width) / 2;
        return new RectF(left, top, left+width, top+height);
    }
}
