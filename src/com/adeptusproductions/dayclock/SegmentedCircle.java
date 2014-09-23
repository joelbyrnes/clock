package com.adeptusproductions.dayclock;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;

public class SegmentedCircle {
    private static final String TAG = "SegmentedCircle";

    Canvas canvas;
    int centerX;
    int centerY;
    float circleSize;
    Paint paint = new Paint();

    public SegmentedCircle(Canvas canvas, float size) {
        this.canvas = canvas;
        centerX = canvas.getWidth() / 2;
        centerY = canvas.getHeight() / 2;
        this.circleSize = size;

        paint.setAntiAlias(true);
    }

    void drawCircle(float size) {
        canvas.drawCircle(centerX, centerY, size, paint);
    }

    void drawSegmentBreaks(float circleSize) {
        // break concentric circles into 24 segments
        RectF faceRect = getCenteredSquare(circleSize);
        for (int a = 0; a < 360; a+=360/24) {
            canvas.drawArc(faceRect, a, 0.5f, true, paint);
        }
    }

    void drawShadow(float circleSize, float startAngle, float sweepAngle) {
        // remove time passed
        paint.setColor(Color.argb(200, 0, 0, 0));
        canvas.drawArc(getCenteredSquare(circleSize), startAngle, sweepAngle, true, paint);
    }

    void drawRing(float outerCircle, float innerCircle, int colour) {
        drawRingSegment(outerCircle, innerCircle, colour, 0, 360);
    }

    void drawRingSegment(float outerCircle, float innerCircle, int colour, float startAngle, float sweepAngle) {
        paint.setColor(colour);
        canvas.drawArc(getCenteredSquare(outerCircle), startAngle, sweepAngle, true, paint);
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