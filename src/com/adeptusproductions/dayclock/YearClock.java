package com.adeptusproductions.dayclock;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.Log;
import android.view.View;

import java.text.SimpleDateFormat;
import java.util.*;

public class YearClock extends View {
    private static final String TAG = "YearClock";

    GregorianCalendar start;
    ClockFace clock;
    float scale = 1;

    public YearClock(Context context) {
        super(context);
        setFocusable(true);
        setFocusableInTouchMode(true);

        // TODO configurable year start (eg July 1st)
        start = getYearStart();

//        int year = start.get(Calendar.YEAR);
//        Log.d(TAG, "calendar says year " + year + " is " + (start.isLeapYear(year) ? "" : "not ") + "a leap year");
//        Log.d(TAG, "calendar says year " + (year + 1) + " is " + (start.isLeapYear(year + 1)? "" : "not ") + "a leap year");
    }

    @Override
    public void onDraw(Canvas canvas) {
//        Log.d(TAG, "drawing year clock face with shorter side " + getShorterSide());

        float circleSize = getShorterSide() * scale;
        clock = new ClockFace(canvas, circleSize);

//        drawYearStartText(canvas, (getHeight() - circleSize) / 2);

        clock.drawCircle(circleSize);

        // green segments
        clock.drawRing(circleSize * 0.99f, circleSize * 0.95f, Color.argb(210, 0, 255, 0));

//        List<ActivityPeriod> activities = new ArrayList<ActivityPeriod>();
//        activities.add(new ActivityPeriod("holiday", date(27, 10), date(7, 11), Color.rgb(255, 128, 0)));
//        activities.add(new ActivityPeriod("sleep", time(1, 0), time(7, 30), Color.BLUE));

        // TODO pass in config
//        drawPeriods(activities, circleSize * 0.95f);

        drawSegmentBreaks();

        GregorianCalendar now = new GregorianCalendar();

        drawTimePassedShadow(now);

        drawDateText(now, canvas);
    }

    private void drawYearStartText(Canvas canvas, float ypos) {
        GregorianCalendar cal = getYearStart();
        SimpleDateFormat sdf = new SimpleDateFormat("MMM d");

        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        paint.setTextAlign(Paint.Align.CENTER);
        paint.setTextSize(12 * scale);

        canvas.drawText(sdf.format(cal.getTime()), clock.centerX, ypos, paint);
    }

    void drawSegmentBreaks() {
        GregorianCalendar cal = date(1, 0);
        int daysThisYear = daysInYear(cal);

        for (int i=0; i < 12; i++) {
            // month is 0-indexed
            cal.set(Calendar.MONTH, i);
            float days = cal.get(Calendar.DAY_OF_YEAR) - 1;
//            Log.d(TAG, "drawing month marker at " + days + " days, " + days * (360f/daysThisYear) + " degrees, " + 100 * days/daysThisYear + " %");
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
        gregorianCalendar.set(GregorianCalendar.MONTH, month);
        gregorianCalendar.set(GregorianCalendar.DAY_OF_MONTH, day);
        return gregorianCalendar;
    }

    private void drawTimePassedShadow(GregorianCalendar now) {
        // get days passed this year
        float passed = (now.get(Calendar.DAY_OF_YEAR) - 1) / new Float(daysInYear(now));
        clock.drawShadow(passed);
    }

    private void drawDateText(Calendar now, Canvas canvas) {
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

    private GregorianCalendar getYearStart() {
        return date(1, 0);
    }

    int getShorterSide() {
        return Math.min(getWidth(), getHeight());
    }

    int getLongerSide() {
        return Math.max(getWidth(), getHeight());
    }
}
