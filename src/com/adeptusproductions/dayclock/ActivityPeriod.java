package com.adeptusproductions.dayclock;

import java.util.Calendar;

/**
 * Created with IntelliJ IDEA.
 * User: joel
 * Date: 23/09/14
 * Time: 10:57 PM
 * To change this template use File | Settings | File Templates.
 */
public class ActivityPeriod {
    String name;
    Calendar start;
    Calendar end;
    int colour;

    public ActivityPeriod(String name, Calendar start, Calendar end, int colour) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.colour = colour;
    }
}
