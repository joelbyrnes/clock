package com.adeptusproductions.dayclock;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.Log;
import android.view.View;

import java.text.SimpleDateFormat;
import java.util.*;

public class YearClock extends View {
    private static final String TAG = "YearClock";

    Calendar start;
    ClockFace clock;
    float scale = 1;

    public YearClock(Context context) {
        super(context);
        setFocusable(true);
        setFocusableInTouchMode(true);

        start = getMidnight();
    }

    @Override
    public void onDraw(Canvas canvas) {
        Log.d(TAG, "drawing year clock face with shorter side " + getShorterSide());

        float circleSize = getShorterSide() * scale;

        clock = new ClockFace(canvas, circleSize);

        // background
        canvas.drawColor(Color.DKGRAY);

        clock.drawCircle(circleSize);

        // green segments
        clock.drawRing(circleSize * 0.99f, circleSize * 0.95f, Color.argb(210, 0, 255, 0));

//        List<ActivityPeriod> activities = new ArrayList<ActivityPeriod>();
//        activities.add(new ActivityPeriod("work", time(9, 30), time(18, 0), Color.rgb(255, 128, 0)));
//        activities.add(new ActivityPeriod("sleep", time(1, 0), time(7, 30), Color.BLUE));

        // TODO pass in config
//        drawPeriods(activities, circleSize * 0.95f);

        drawSegmentBreaks();

        Calendar now = Calendar.getInstance();

//        drawTimePassedShadow(start, now, circleSize);

        drawDate(now, canvas);
    }

    void drawSegmentBreaks() {
        GregorianCalendar cal = date(1, 0);
        int year = cal.get(Calendar.YEAR);
        Log.d(TAG, "calendar says year " + year + " is " + (cal.isLeapYear(year)? "" : "not ") + "a leap year");
        Log.d(TAG, "calendar says year " + (year + 1) + " is " + (cal.isLeapYear(year + 1)? "" : "not ") + "a leap year");

        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        SimpleDateFormat sdf = new SimpleDateFormat("dd, MMM, yyyy");
        clock.canvas.drawText(sdf.format(cal.getTime()), 5, 10, paint);

        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.BLACK);

        int daysThisYear = daysInYear(cal);

        for (int i=0; i < 12; i++) {
            cal.set(Calendar.MONTH, i);
            int days = cal.get(Calendar.DAY_OF_YEAR);

            Log.d(TAG, "drawing month marker at " + days + " days, " + days * (360f/daysThisYear) + " degrees, " + 100 * days/daysThisYear + " %");
//            clock.canvas.drawArc(faceRect, -90 + days * dayAngle, 0.5f, true, paint);
            clock.drawSegmentBreak(days/daysThisYear);
        }
    }

    private int daysInYear(GregorianCalendar cal) {
        return cal.isLeapYear(cal.get(Calendar.YEAR)) ? 366 : 365;
    }

    private void drawPeriods(List<ActivityPeriod> activities, float size) {
        float segmentThickness = 0.1f;

        for (ActivityPeriod activity : activities) {
            drawPeriod(activity.start, activity.end, size * 0.99f, size *= 0.85f, activity.colour);
        }
    }

    private void drawPeriod(Calendar start, Calendar end, float circleOuter, float circleInner, int colour) {
        long startDiff = (start.getTimeInMillis() - this.start.getTimeInMillis());
        float startAngle = startDiff / (24 * 60 * 60 * 1000f) * 360;

        long endDiff = (end.getTimeInMillis() - start.getTimeInMillis());
        float sweepAngle = endDiff / (24 * 60 * 60 * 1000f) * 360;

        clock.drawRingSegment(circleOuter, circleInner, colour, startAngle, sweepAngle);
    }

    // months are zero-indexed, ie jan 1st is 1, 0.
    GregorianCalendar date(int day, int month) {
        GregorianCalendar gregorianCalendar = new GregorianCalendar();
        // make it have the correct year, not the year since 1900
        gregorianCalendar.set(GregorianCalendar.YEAR, gregorianCalendar.get(GregorianCalendar.YEAR));
        gregorianCalendar.set(GregorianCalendar.MONTH, month);
        gregorianCalendar.set(GregorianCalendar.DAY_OF_MONTH, day);
        return gregorianCalendar;
    }

    private void drawTimePassedShadow(GregorianCalendar now) {
        // get days passed this year
        float passed = (now.get(Calendar.DAY_OF_YEAR) - 1) / daysInYear(now);
        clock.drawShadow(360 * passed);
    }

    private void drawDate(Calendar now, Canvas canvas) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);
        paint.setColor(Color.WHITE);
        float timeSize = 26 * scale;
        paint.setTextSize(timeSize);
        paint.setTextAlign(Paint.Align.CENTER);
        SimpleDateFormat sdf = new SimpleDateFormat("E, MMM d");
        canvas.drawText(sdf.format(now.getTime()), clock.centerX, clock.centerY, paint);
        paint.setTextSize(18 * scale);
        SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy");
        canvas.drawText(dateSdf.format(now.getTime()), clock.centerX, clock.centerY + timeSize, paint);
    }

    private Calendar getMidnight() {
        return date(1, 1);
    }

    int getShorterSide() {
        return Math.min(getWidth(), getHeight());
    }

    int getLongerSide() {
        return Math.max(getWidth(), getHeight());
    }
}
