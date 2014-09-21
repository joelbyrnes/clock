package com.adeptusproductions.dayclock;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.text.format.Time;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.WindowManager;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

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

    public ClockFace(Context context) {
        super(context);
        setFocusable(true);
        setFocusableInTouchMode(true);

        paint.setAntiAlias(true);
    }

    @Override
    public void onDraw(Canvas canvas) {
        Log.d(TAG, "drawing circles");

        Display disp = ((WindowManager)this.getContext().getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();

        // background
//        canvas.drawColor(Color.DKGRAY);

//        paint.setColor(Color.BLUE);
//        canvas.drawRect(0, 0, getWidth(), getHeight(), paint);
//        paint.setColor(Color.CYAN);
//        canvas.drawRect(new RectF(50, 50, getWidth() - 100, getHeight() - 100), paint);
//        canvas.drawRect(getCenteredRect(getWidth() - 100, getHeight() - 100), paint);

        int centerX = getWidth() / 2;
        int centerY = getHeight() / 2;
        long circleSize = getShorterSide();
        RectF faceRect = getCenteredSquare(circleSize);

//        drawRing()

        drawRing(canvas, circleSize - 5, circleSize - 10, Color.DKGRAY);

        drawRing(canvas, circleSize * 0.9f, circleSize * 0.8f, Color.argb(255, 0, 255, 0));

//        paint.setColor(Color.CYAN);
//        canvas.drawRect(getCenteredSquare(circleSize * 0.8f), paint);

        drawRingSegment(canvas, circleSize * 0.8f - 2, circleSize * 0.7f, Color.RED, 52.5f, 8 * 15);

        // set background? seems to change colour of last black circle too.
//        canvas.drawARGB(100, 255, 255, 0);

        // break concentric circles into 24 segments
        for (int a = 0; a < 360; a+=360/24) {
            canvas.drawArc(getCenteredSquare(circleSize-10), a, 0.5f, true, paint);
        }

        // seconds hand (indicative only)
//        paint.setColor(Color.YELLOW);
//        paint.setStrokeWidth(1.2f);
//        canvas.drawLine(centerX, centerY, centerX+getWidth(), centerY+getWidth(), paint);

        // get time passed today
        Calendar m = getMidnight();
        long millisAtMidnight = m.getTimeInMillis();

        Calendar now = Calendar.getInstance();
        long millis = now.getTimeInMillis() - millisAtMidnight;
        float doneToday = millis / (24 * 60 * 60 * 1000f);

        // remove time passed
        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(circleSize-10), -90, (360 * doneToday), true, paint);

        paint.setColor(Color.WHITE);
//        canvas.drawText(millis + "ms today", 5, 10, paint);
//        canvas.drawText((doneToday * 100) + "% today", 5, 25, paint);

        paint.setTextSize(26);
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        canvas.drawText(sdf.format(now.getTime()), centerX-40, centerY, paint);
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

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        Log.d(TAG, "onMeasure");

        int h = View.MeasureSpec.getSize(heightMeasureSpec);
        int w = View.MeasureSpec.getSize(widthMeasureSpec);

        setMeasuredDimension(w, h);
    }
}
