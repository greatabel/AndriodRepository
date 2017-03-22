package com.example.wanchang.a10fragment_argument;


import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;

import com.example.wanchang.a08fragment_layout.R;

import java.util.List;
import java.util.UUID;


public class CrimePagerActivity extends FragmentActivity {

    private static final String EXTRA_CRIME_ID =
            "com.example.wanchang.a10fragment_argument.crime_id";

    private ViewPager mViewPager;
    private List<Crime> mCrimes;

    public static Intent newIntent(Context packageContext,
                                   UUID crimeId){
        Intent intent = new Intent(packageContext, CrimePagerActivity.class);
        intent.putExtra(EXTRA_CRIME_ID, crimeId);
        return intent;
    }


     @Override
     protected void onCreate(Bundle savedInstanceState){
         super.onCreate(savedInstanceState);
         setContentView(R.layout.activity_crime_pager);

         UUID crimeId = (UUID) getIntent()
                            .getSerializableExtra(EXTRA_CRIME_ID);

         mViewPager = (ViewPager)findViewById(R.id.activity_crime_pager_view_pager);

         mCrimes = CrimeLab.get(this).getmCrimes();
         FragmentManager fragmentManager = getSupportFragmentManager();
         mViewPager.setAdapter(new FragmentStatePagerAdapter(fragmentManager) {
             @Override
             public Fragment getItem(int position) {
                 Crime crime = mCrimes.get(position);

                 return CrimeFragment.newInstance(crime.getmId());
             }

             @Override
             public int getCount() {
                 return mCrimes.size();
             }
         });
     }
 }
