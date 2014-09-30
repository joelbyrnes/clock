package com.adeptusproductions.dayclock;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.Log;
import android.view.View;

public class ClockFace {
    private static final String TAG = "ClockFace";

    View view;
    Canvas canvas;
    float centerX;
    float centerY;
    float circleSize;
    RectF faceRect;

    Paint paint = new Paint();

    public ClockFace(View view, Canvas canvas, float size) {
        this.view = view;
        this.canvas = canvas;
        centerX = view.getWidth() / 2;
        centerY = view.getHeight() / 2;
        this.circleSize = size;
        faceRect = getCenteredSquare(circleSize);

//        Log.d(TAG, "view   width = " + view.getWidth() + ", height = " + view.getHeight());
//        Log.d(TAG, "canvas width = " + canvas.getWidth() + ", height = " + canvas.getHeight());

        paint.setAntiAlias(true);
    }

    void drawCircle(float size) {
        canvas.drawCircle(centerX, centerY, size, paint);
    }

    void drawSegmentBreak(float position) {
        drawSpoke(position, Color.BLACK);
    }

    void drawSpoke(float position, int color) {
        paint.setColor(color);
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

    void drawRingSegment(float outerCircle, float innerCircle, int colour, float startPosition, float proportion) {
        paint.setColor(colour);
        // take 90 because circle starts at 3 o'clock position and we want it to start at 0/12
        canvas.drawArc(getCenteredSquare(outerCircle), -90 + startPosition * 360, proportion * 360, true, paint);
        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(innerCircle), 0, 360, true, paint);
    }

    RectF getCenteredSquare(float size) {
        return getCenteredRect(size, size);
    }

    RectF getCenteredRect(float width, float height) {
        float top = (view.getHeight() - height) / 2;
        float left = (view.getWidth() - width) / 2;
        return new RectF(left, top, left+width, top+height);
    }
}
