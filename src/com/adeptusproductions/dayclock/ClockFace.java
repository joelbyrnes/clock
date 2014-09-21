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

/**
 * Created with IntelliJ IDEA.
 * User: joel
 * Date: 18/09/14
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
public class ClockFace extends View {
    private static final String TAG = "ClockFace";

    Paint paint = new Paint();
    int centerX;
    int centerY;
    Calendar dayStart;

    public ClockFace(Context context) {
        super(context);
        setFocusable(true);
        setFocusableInTouchMode(true);

        paint.setAntiAlias(true);
        dayStart = getMidnight();
    }

    @Override
    public void onDraw(Canvas canvas) {
        Log.d(TAG, "drawing clock face");

        // background
//        canvas.drawColor(Color.DKGRAY);

        centerX = getWidth() / 2;
        centerY = getHeight() / 2;
        int circleSize = getShorterSide();

        // green segments
        drawRing(canvas, circleSize * 0.99f, circleSize * 0.95f, Color.argb(210, 0, 255, 0));

        // TODO pass in config
        drawPeriods(canvas, circleSize * 0.94f);

        drawSegmentBreaks(canvas, circleSize);

        Calendar now = Calendar.getInstance();

        drawTimePassedShadow(dayStart, now, circleSize, canvas);

        // outer solid ring
//        drawRing(canvas, circleSize * 0.99f, circleSize * 0.97f, Color.DKGRAY);

        drawTimeAndDate(now, canvas);
    }

    private void drawPeriods(Canvas canvas, float size) {
        float segmentThickness = 0.1f;

        drawPeriod(canvas, time(9, 30), time(18, 0), size, size * 0.9f, Color.argb(255, 255, 128, 0));
        drawPeriod(canvas, time(1, 0), time(7, 30), size * 0.9f * 0.99f, size * 0.8f, Color.BLUE);

        // tests
//        drawPeriod(canvas, time(0, 0), time(3, 0), size * 0.798f, size * 0.7f, Color.CYAN);
//        drawRingSegment(canvas, circleSize * 0.5f * 0.99f, circleSize * 0.4f, Color.MAGENTA, 45-180, 6 * 15);
//        drawRingSegment(canvas, circleSize * 0.4f * 0.99f, circleSize * 0.3f, Color.YELLOW, 60-180, 6 * 15);
//        drawRingSegment(canvas, circleSize * 0.3f * 0.99f, circleSize * 0.2f, Color.LTGRAY, 75-180, 6 * 15);
    }

    private void drawPeriod(Canvas canvas, Calendar start, Calendar end, float circleOuter, float circleInner, int colour) {
        long startDiff = (start.getTimeInMillis() - dayStart.getTimeInMillis());
        float startAngle = startDiff / (24 * 60 * 60 * 1000f) * 360;

        long endDiff = (end.getTimeInMillis() - start.getTimeInMillis());
        float sweepAngle = endDiff / (24 * 60 * 60 * 1000f) * 360;

        // take 90 because circle starts at 3 o'clock position and we want it to start at 0/12
        drawRingSegment(canvas, circleOuter, circleInner, colour, startAngle - 90, sweepAngle);
    }

    Calendar time(int hours, int mins) {
        Calendar m = Calendar.getInstance(); //midnight
        m.set(Calendar.HOUR_OF_DAY, hours);
        m.set(Calendar.MINUTE, mins);
        m.set(Calendar.SECOND, 0);
        m.set(Calendar.MILLISECOND, 0);
        return m;
    }

    private void drawSegmentBreaks(Canvas canvas, int circleSize) {
        // break concentric circles into 24 segments
        RectF faceRect = getCenteredSquare(circleSize);
        for (int a = 0; a < 360; a+=360/24) {
            canvas.drawArc(faceRect, a, 0.5f, true, paint);
        }
    }

    private void drawTimePassedShadow(Calendar m, Calendar now, float circleSize, Canvas canvas) {
        // get time passed today
        long millisAtMidnight = m.getTimeInMillis();
        long millis = now.getTimeInMillis() - millisAtMidnight;
        float doneToday = millis / (24 * 60 * 60 * 1000f);

        // remove time passed
        paint.setColor(Color.argb(200, 0, 0, 0));
        canvas.drawArc(getCenteredSquare(circleSize), -90, 360 * doneToday, true, paint);
    }

    private void drawTimeAndDate(Calendar now, Canvas canvas) {
        paint.setColor(Color.WHITE);
        paint.setTextSize(26);
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        canvas.drawText(sdf.format(now.getTime()), centerX-32, centerY, paint);
        paint.setTextSize(18);
        SimpleDateFormat dateSdf = new SimpleDateFormat("E, MMM d");
        canvas.drawText(dateSdf.format(now.getTime()), centerX-42, centerY+26, paint);
    }

    private Calendar getMidnight() {
        Calendar m = Calendar.getInstance(); //midnight
        m.set(Calendar.HOUR_OF_DAY, 0);
        m.set(Calendar.MINUTE, 0);
        m.set(Calendar.SECOND, 0);
        m.set(Calendar.MILLISECOND, 0);
        return m;
    }

    private void drawRing(Canvas canvas, float outerCircle, float innerCircle, int colour) {
        drawRingSegment(canvas, outerCircle, innerCircle, colour, 0, 360);
    }

    private void drawRingSegment(Canvas canvas, float outerCircle, float innerCircle, int colour, float startAngle, float sweepAngle) {
        paint.setColor(colour);
        canvas.drawArc(getCenteredSquare(outerCircle), startAngle, sweepAngle, true, paint);
        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(innerCircle), 0, 360, true, paint);
    }

    RectF getCenteredSquare(float size) {
        return getCenteredRect(size, size);
    }

    RectF getCenteredRect(float width, float height) {
        float top = (getHeight() - height) / 2;
        float left = (getWidth() - width) / 2;
        return new RectF(left, top, left+width, top+height);
    }

    int getShorterSide() {
        return Math.min(getWidth(), getHeight());
    }

    int getLongerSide() {
        return Math.max(getWidth(), getHeight());
    }
}
