package com.adeptusproductions.dayclock;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.WindowManager;

import java.text.SimpleDateFormat;
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

        paint.setColor(Color.DKGRAY);
        canvas.drawArc(getCenteredSquare(circleSize-5), 0, 360, true, paint);
        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(circleSize-10), 0, 360, true, paint);

        paint.setColor(Color.GREEN);
        canvas.drawArc(getCenteredSquare(circleSize * 0.9f), 0, 360, true, paint);
        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(circleSize * 0.8f), 0, 360, true, paint);

//        paint.setColor(Color.CYAN);
//        canvas.drawRect(getCenteredSquare(circleSize * 0.8f), paint);
        paint.setColor(Color.RED);
//        canvas.drawCircle(centerX, centerY, circleSize * 0.8f, paint);
        canvas.drawArc(getCenteredSquare(circleSize * 0.8f-2), 30, 10*15, true, paint);

        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(circleSize * 0.6f), 0, 360, true, paint);

        // set background? seems to change colour of last black circle too.
//        canvas.drawARGB(100, 255, 255, 0);

        // break concentric circles into 24 segments
        for (int a = 0; a < 360; a+=360/24) {
            canvas.drawArc(getCenteredSquare(circleSize-10), a, 0.5f, true, paint);
        }

        // remove time passed
        paint.setColor(Color.BLACK);
        canvas.drawArc(getCenteredSquare(circleSize-10), -90, 165, true, paint);

        // seconds hand (indicative only)
//        paint.setColor(Color.YELLOW);
//        paint.setStrokeWidth(1.2f);
//        canvas.drawLine(centerX, centerY, centerX+getWidth(), centerY+getWidth(), paint);

        paint.setColor(Color.WHITE);
        paint.setTextSize(20);
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm a");
        canvas.drawText(sdf.format(new Date()), centerX-40, centerY, paint);
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
