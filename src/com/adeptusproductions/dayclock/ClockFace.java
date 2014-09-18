package com.adeptusproductions.dayclock;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.Log;
import android.view.Display;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;

import java.util.ArrayList;
import java.util.List;

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

//        paint.setColor(Color.BLUE);
//        canvas.drawRect(0, 0, getWidth(), getHeight(), paint);
//        paint.setColor(Color.CYAN);
//        canvas.drawRect(new RectF(50, 50, getWidth() - 100, getHeight() - 100), paint);

        int centerX = getWidth() / 2;
        int centerY = getHeight() / 2;
        long circleSize = Math.round(getWidth() / 2 * .9);
        int faceTop = (getHeight() - getWidth()) / 2;
        RectF faceRect = new RectF(0, faceTop, getWidth(), faceTop+getWidth());

        paint.setColor(Color.GREEN);
        canvas.drawCircle(centerX, centerY, circleSize, paint);
        paint.setColor(Color.RED);
//        canvas.drawCircle(centerX, centerY, Math.round(circleSize * 0.8), paint);
        canvas.drawArc(faceRect, 45, 11*15, true, paint);
        paint.setColor(Color.BLACK);
        canvas.drawCircle(centerX, centerY, Math.round(circleSize * 0.6), paint);

        // break concentric circles into 24 segments
        for (int a = 0; a < 360; a+=360/24) {
            canvas.drawArc(faceRect, a, 0.5f, true, paint);
        }

        // seconds hand (indicative only)
        paint.setColor(Color.YELLOW);
        paint.setStrokeWidth(1.2f);
        canvas.drawLine(centerX, centerY, centerX+getWidth(), centerY+getWidth(), paint);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        Log.d(TAG, "onMeasure");

        int h = View.MeasureSpec.getSize(heightMeasureSpec);
        int w = View.MeasureSpec.getSize(widthMeasureSpec);

        setMeasuredDimension(w, h);
    }
}
