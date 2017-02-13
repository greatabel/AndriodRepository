package com.luminagic.wanchang.a16event;

import android.net.Uri;
import android.provider.BaseColumns;

/**
 * Created by wanchang on 2017/2/13.
 */
public interface Constants extends BaseColumns {
    public  static final String TABLE_NAME = "events";

    public static final String AUTHORITY = "com.luminagic.wanchang.a16event";
    public static final Uri CONTENT_URI = Uri.parse("content://"
            + AUTHORITY + "/" + TABLE_NAME);

    public  static final String TIME = "time";
    public  static final String TITLE = "title";
}
