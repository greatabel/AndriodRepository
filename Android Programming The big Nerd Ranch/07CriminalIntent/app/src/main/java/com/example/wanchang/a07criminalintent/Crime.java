package com.example.wanchang.a07criminalintent;

import java.util.UUID;

/**
 * Created by wanchang on 2017/3/7.
 */

public class Crime {
    private UUID mId;
    private  String mTitle;

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
    }
}
