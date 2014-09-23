package com.adeptusproductions.dayclock;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.Log;
import android.view.View;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class SegmentedCircle {
    private static final String TAG = "SegmentedCircle";

    View view;
    int centerX;
    int centerY;
    int circleSize;
    Paint paint = new Paint();

    public SegmentedCircle(View view, int size) {
        this.view = view;
        centerX = view.getWidth() / 2;
        centerY = view.getHeight() / 2;
        this.circleSize = size;

        paint.setAntiAlias(true);
    }

    void drawSegmentBreaks(Canvas canvas, int circleSize) {
        // break concentric circles into 24 segments
        RectF faceRect = getCenteredSquare(circleSize);
        for (int a = 0; a < 360; a+=360/24) {
            canvas.drawArc(faceRect, a, 0.5f, true, paint);
        }
    }

    void drawShadow(Canvas canvas, float circleSize, float startAngle, float sweepAngle) {
        // remove time passed
        paint.setColor(Color.argb(200, 0, 0, 0));
        canvas.drawArc(getCenteredSquare(circleSize), startAngle, sweepAngle, true, paint);
    }

    void drawRing(Canvas canvas, float outerCircle, float innerCircle, int colour) {
        drawRingSegment(canvas, outerCircle, innerCircle, colour, 0, 360);
    }

    void drawRingSegment(Canvas canvas, float outerCircle, float innerCircle, int colour, float startAngle, float sweepAngle) {
        paint.setColor(colour);
        canvas.drawArc(getCenteredSquare(outerCircle), startAngle, sweepAngle, true, paint);
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

    int getShorterSide() {
        return Math.min(view.getWidth(), view.getHeight());
    }

    int getLongerSide() {
        return Math.max(view.getWidth(), view.getHeight());
    }
}
