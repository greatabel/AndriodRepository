package com.example.wanchang.a08fragment_layout;


import android.content.Context;

public class CrimeLab {
    private  static CrimeLab sCrimeLab;

    public static CrimeLab get(Context context) {
        if(sCrimeLab == null) {
            sCrimeLab = new CrimeLab(context);
        }
        return sCrimeLab;
    }

    private CrimeLab(Context context) {
        
    }

}
