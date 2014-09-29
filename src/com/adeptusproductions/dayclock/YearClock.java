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
    SegmentedCircle circle;
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

        circle = new SegmentedCircle(canvas, circleSize);

        // background
        canvas.drawColor(Color.DKGRAY);

        circle.drawCircle(circleSize);

        // green segments
        circle.drawRing(circleSize * 0.99f, circleSize * 0.95f, Color.argb(210, 0, 255, 0));

//        List<ActivityPeriod> activities = new ArrayList<ActivityPeriod>();
//        activities.add(new ActivityPeriod("work", time(9, 30), time(18, 0), Color.rgb(255, 128, 0)));
//        activities.add(new ActivityPeriod("sleep", time(1, 0), time(7, 30), Color.BLUE));

        // TODO pass in config
//        drawPeriods(activities, circleSize * 0.95f);

        drawSegmentBreaks(circleSize);

        Calendar now = Calendar.getInstance();

//        drawTimePassedShadow(start, now, circleSize);

        drawDate(now, canvas);
    }

    void drawSegmentBreaks(float circleSize) {
        // break concentric circles into 24 segments
        RectF faceRect = circle.getCenteredSquare(circleSize);
        GregorianCalendar cal = date(1, 0);

        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        SimpleDateFormat sdf = new SimpleDateFormat("dd, MMM, yyyy");
        circle.canvas.drawText(sdf.format(cal.getTime()), 5, 10, paint);

//        cal.get(Calendar.DAY_OF_YEAR);

        float febDays = cal.isLeapYear(cal.get(Calendar.YEAR)) ? 29f : 28f;
        int daysSoFar = 0;

        int days[] = new int[12];
        days[0] = 0; // jan 1st
        days[1] = daysSoFar += 31; // jan 1st + 31 = feb 1st
        days[2] = daysSoFar += febDays;
        days[3] = daysSoFar += 31;
        days[4] = daysSoFar += 30;
        days[5] = daysSoFar += 31; // june 1st
        days[6] = daysSoFar += 30;
        days[7] = daysSoFar += 31;
        days[8] = daysSoFar += 31; // sep 1st
        days[9] = daysSoFar += 30;
        days[10] = daysSoFar += 31;
        days[11] = daysSoFar += 30; // dec 1st

        int daysThisYear = days[11] + 31; // add dec days

        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.BLACK);

        float dayAngle = 360f/daysThisYear;

        for (int i=0; i < 12; i++) {
            Log.d(TAG, "drawing month marker at " + days[i] + " days, " + days[i] * dayAngle + " degrees");
            circle.canvas.drawArc(faceRect, -90 + days[i] * dayAngle, 0.5f, true, paint); // jan 1st
        }
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

        // take 90 because circle starts at 3 o'clock position and we want it to start at 0/12
        circle.drawRingSegment(circleOuter, circleInner, colour, startAngle - 90, sweepAngle);
    }

    // months are zero-indexed, ie jan 1st is 1, 0.
    GregorianCalendar date(int day, int month) {
        GregorianCalendar gregorianCalendar = new GregorianCalendar();
        gregorianCalendar.set(GregorianCalendar.MONTH, month);
        gregorianCalendar.set(GregorianCalendar.DAY_OF_MONTH, day);
        return gregorianCalendar;
    }

    private void drawTimePassedShadow(Calendar m, Calendar now, float circleSize) {
        // get time passed today
        long millisAtMidnight = m.getTimeInMillis();
        long millis = now.getTimeInMillis() - millisAtMidnight;
        float doneToday = millis / (24 * 60 * 60 * 1000f);

        circle.drawShadow(circleSize, -90, 360 * doneToday);
    }

    private void drawDate(Calendar now, Canvas canvas) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);
        paint.setColor(Color.WHITE);
        float timeSize = 26 * scale;
        paint.setTextSize(timeSize);
        paint.setTextAlign(Paint.Align.CENTER);
        SimpleDateFormat sdf = new SimpleDateFormat("E, MMM d");
        canvas.drawText(sdf.format(now.getTime()), circle.centerX, circle.centerY, paint);
        paint.setTextSize(18 * scale);
        SimpleDateFormat dateSdf = new SimpleDateFormat("yyyy");
        canvas.drawText(dateSdf.format(now.getTime()), circle.centerX, circle.centerY+timeSize, paint);
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
