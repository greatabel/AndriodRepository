package com.example.wanchang.a10fragment_argument;


import android.os.Build;
import android.util.Log;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;


public class Crime {
    private UUID mId;
    private  String mTitle;
    private Date mDate;

    public boolean ismSolved() {
        return mSolved;
    }

    public void setmSolved(boolean mSolved) {
        this.mSolved = mSolved;
    }

    private  boolean mSolved;

    public Date getmDate() {
        return mDate;
    }

    public void setmDate(Date mDate) {
        this.mDate = mDate;
    }

    public void setmDate_Hour_Minute_Part(Date mHourMinuteDatePart) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(getmDate());

        Calendar cal_out = Calendar.getInstance();
        cal_out.setTime(mHourMinuteDatePart);
        int hours = cal_out.get(Calendar.HOUR_OF_DAY);
        int minutes = cal_out.get(Calendar.MINUTE);

        cal.set(Calendar.HOUR_OF_DAY, hours);
        cal.set(Calendar.MINUTE, minutes);
        Log.d("part time>", cal.getTime().toString());
        setmDate(cal.getTime());
    }

    public String getmTitle() {
        return mTitle;
    }

    public void setmTitle(String mTitle) {
        this.mTitle = mTitle;
    }

    public UUID getmId() {
        return mId;
    }

    public void setmId(UUID mId) {
        this.mId = mId;
    }

    public Crime() {
        mId = UUID.randomUUID();
        mDate = new Date();
        // 变成3天前
        Calendar cal = Calendar.getInstance();
        cal.setTime(mDate);
        cal.add(Calendar.DATE, -3);
        Date dateBefore30Days = cal.getTime();
        mDate = dateBefore30Days;
    }
}
