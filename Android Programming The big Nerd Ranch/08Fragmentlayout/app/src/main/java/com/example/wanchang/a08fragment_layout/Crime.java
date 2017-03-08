package com.example.wanchang.a08fragment_layout;


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
    }
}
