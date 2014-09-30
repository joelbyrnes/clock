package com.adeptusproductions.dayclock;

import java.util.GregorianCalendar;

/**
 * Created with IntelliJ IDEA.
 * User: joel
 * Date: 23/09/14
 * Time: 10:57 PM
 * To change this template use File | Settings | File Templates.
 */
public class ActivityPeriod {
    String name;
    GregorianCalendar start;
    GregorianCalendar end;
    int colour;

    public ActivityPeriod(String name, GregorianCalendar start, GregorianCalendar end, int colour) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.colour = colour;
    }
}
