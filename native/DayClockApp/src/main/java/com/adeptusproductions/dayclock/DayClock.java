package com.adeptusproductions.dayclock;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.Log;
import android.view.View;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: joel
 * Date: 18/09/14
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
public class DayClock extends View {
    private static final String TAG = "DayClock";

    GregorianCalendar dayStart;
    ClockFace clock;
    float circleSize;
    float scale = 1;

    public DayClock(Context context) {
        super(context);
        setFocusable(true);
        setFocusableInTouchMode(true);

        dayStart = time(0,0);
    }

    @Override
    public void onDraw(Canvas canvas) {
        Log.d(TAG, "canvas width = " + canvas.getWidth() + ", height = " + canvas.getHeight());

        clock = new ClockFace(this, canvas, circleSize);

        clock.drawCircle(circleSize);

        // green segments
        clock.drawRing(circleSize * 0.99f, circleSize * 0.95f, Color.argb(210, 0, 255, 0));

        List<ActivityPeriod> activities = new ArrayList<ActivityPeriod>();
        activities.add(new ActivityPeriod("work", time(9, 30), time(18, 0), Color.rgb(255, 128, 0)));
        activities.add(new ActivityPeriod("sleep", time(1, 0), time(7, 30), Color.BLUE));

        drawMoment(time(23, 0), circleSize * 0.95f, circleSize * 0.85f, Color.YELLOW);

        // tests
//        activities.add(new ActivityPeriod("test1", time(13, 0), time(21, 0), Color.CYAN));
//        activities.add(new ActivityPeriod("test2", time(14, 0), time(22, 0), Color.MAGENTA));
//        activities.add(new ActivityPeriod("test3", time(15, 0), time(23, 0), Color.YELLOW));
//        activities.add(new ActivityPeriod("test4", time(16, 0), time(24, 0), Color.LTGRAY));

        drawPeriods(activities, circleSize * 0.95f);

        drawSegmentBreaks();

        Calendar now = Calendar.getInstance();

        drawTimePassedShadow(dayStart, now);

        // TODO generify this - drawCenteredText?
        drawTimeAndDate(now, canvas);
    }

    void drawSegmentBreaks() {
        // break concentric circles into 24 segments
        for (int h = 0; h < 24; h++) {
            clock.drawSegmentBreak(h / 24f);
        }
    }

    private void drawPeriods(List<ActivityPeriod> activities, float size) {
        float segmentThickness = 0.1f;

        for (ActivityPeriod activity : activities) {
            drawPeriod(activity.start, activity.end, size * 0.99f, size *= 0.85f, activity.colour);
        }
    }

    private void drawPeriod(Calendar start, Calendar end, float circleOuter, float circleInner, int colour) {
        long startDiff = (start.getTimeInMillis() - dayStart.getTimeInMillis());
        float startPosition = startDiff / (24 * 60 * 60 * 1000f);

        long endDiff = (end.getTimeInMillis() - start.getTimeInMillis());
        float proportion = endDiff / (24 * 60 * 60 * 1000f);

        clock.drawRingSegment(circleOuter, circleInner, colour, startPosition, proportion);
    }

    private void drawMoment(Calendar moment, float circleOuter, float circleInner, int colour) {
        long startDiff = (moment.getTimeInMillis() - dayStart.getTimeInMillis());
        float startPosition = startDiff / (24 * 60 * 60 * 1000f);

        // 5 mins
        float proportion = 5f / (24 * 60);
//        Log.d(TAG, "drawing moment at time " + moment + ", " + startPosition + ", length " + proportion);

        clock.drawRingSegment(circleOuter, circleInner, colour, startPosition, proportion);
//        clock.drawSpoke(startPosition, colour);
    }

    GregorianCalendar time(int hours, int mins) {
        GregorianCalendar m = new GregorianCalendar(); //midnight
        m.set(Calendar.HOUR_OF_DAY, hours);
        m.set(Calendar.MINUTE, mins);
        m.set(Calendar.SECOND, 0);
        m.set(Calendar.MILLISECOND, 0);
        return m;
    }

    private void drawTimePassedShadow(Calendar m, Calendar now) {
        // get time passed today
        long millisAtMidnight = m.getTimeInMillis();
        long millis = now.getTimeInMillis() - millisAtMidnight;
        float doneToday = millis / (24 * 60 * 60 * 1000f);

        clock.drawShadow(doneToday);
    }

    private void drawTimeAndDate(Calendar now, Canvas canvas) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);
        paint.setColor(Color.WHITE);
        float timeSize = 26 * scale;
        paint.setTextSize(timeSize);
		paint.setTextAlign(Paint.Align.CENTER);
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        canvas.drawText(sdf.format(now.getTime()), clock.centerX, clock.centerY, paint);
        paint.setTextSize(18 * scale);
        SimpleDateFormat dateSdf = new SimpleDateFormat("E, MMM d");
        canvas.drawText(dateSdf.format(now.getTime()), clock.centerX, clock.centerY + timeSize, paint);
    }

    private GregorianCalendar getMidnight() {
        return time(0,0);
    }

    int getShorterSide() {
        return Math.min(getWidth(), getHeight());
    }

    int getLongerSide() {
        return Math.max(getWidth(), getHeight());
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);

        Log.d(TAG, "view width = " + w + ", height = " + h);
        Log.d(TAG, "drawing day clock with shorter side " + Math.min(w, h));

        circleSize = Math.min(w, h) * scale;
    }
}
