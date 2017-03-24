package com.example.wanchang.a10fragment_argument;


import android.content.Context;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CrimeLab {
    private  static CrimeLab sCrimeLab;

    public List<Crime> getmCrimes() {
        return mCrimes;
    }
    // just to test
    public void test_change(int position){
        if (position < mCrimes.size()) {
            mCrimes.get(position).setmTitle("test " + position);
        }
//        for(int i=0; i< 20;i++) {
//
//            mCrimes.get(i).setmTitle("test " + i);
//        }
    }

    public Crime getCrime(UUID id){
        for(Crime crime: mCrimes){
            if(crime.getmId().equals(id)){
                return crime;
            }
        }
        return  null;
    }



    private List<Crime> mCrimes;

    public static CrimeLab get(Context context) {
        if(sCrimeLab == null) {
            sCrimeLab = new CrimeLab(context);
        }
        return sCrimeLab;
    }

    private CrimeLab(Context context) {
        mCrimes = new ArrayList<>();
        for(int i=0; i< 30;i++){
            Crime crime = new Crime();
            crime.setmTitle("缺点 #" + i);
            crime.setmSolved(i % 2 == 0);
            mCrimes.add(crime);
        }
    }


}
