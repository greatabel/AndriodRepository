package com.example.wanchang.a10fragment_argument;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;

import com.example.wanchang.a08fragment_layout.R;

import java.util.List;


public class CrimePagerActivity extends FragmentActivity {

    private ViewPager mViewPager;
    private List<Crime> mCrimes;

     @Override
     protected void onCreate(Bundle savedInstanceState){
         super.onCreate(savedInstanceState);
         setContentView(R.layout.activity_crime_pager);

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
