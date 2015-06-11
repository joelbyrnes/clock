package com.adeptusproductions.dayclock;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

public class MainActivity extends Activity
{
    private static final long MILLISECONDS_TILL_UPDATE = 1000;
    View view;

    // for refreshing every second (even once a minute would be fine)
    Handler viewHandler = new Handler();
    Runnable updateView = new Runnable(){
        @Override
        public void run(){
            view.invalidate();
            viewHandler.postDelayed(updateView, MILLISECONDS_TILL_UPDATE);
        }
    };

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        // Set full screen view
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        view = new DayClock(this);
//        view = new YearClock(this);
        setContentView(view);
        view.requestFocus();

        // start update loop
        viewHandler.post(updateView);
    }
}
