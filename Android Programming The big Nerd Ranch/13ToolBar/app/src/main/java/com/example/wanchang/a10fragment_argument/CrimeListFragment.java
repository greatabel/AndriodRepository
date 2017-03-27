package com.example.wanchang.a10fragment_argument;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.TextView;
import android.widget.Toast;

import com.example.wanchang.a08fragment_layout.R;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


public class CrimeListFragment extends Fragment {
    /*
    item 之间很大空隙问题
    http://stackoverflow.com/questions/35728179/recyclerview-items-with-big-empty-space-after-23-2-0
    修改 list_item_crime.xml
    <RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                xmlns:tools="http://schemas.android.com/tools"
                android:layout_width="match_parent"
                android:layout_height="match_content">
    的layout_height 为 wrap_content

     */

    private RecyclerView mCrimeRecyclerView;
    private CrimeAdapter mAdapter;

    CrimeLab crimeLab = CrimeLab.get(getActivity());
    List<Crime> crimes = crimeLab.getmCrimes();

    // exercise 1
    int click_index = -1;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState){
        View view = inflater.inflate(R.layout.fragment_crime_list, container, false);
        mCrimeRecyclerView = (RecyclerView)view
                .findViewById(R.id.crime_recycler_view);
        mCrimeRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        updateUI();


        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        updateUI();
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater){
        super.onCreateOptionsMenu(menu, inflater);
        inflater.inflate(R.menu.fragment_crime_list, menu);
    }

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);
    }



    private void updateUI() {
//        CrimeLab crimeLab = CrimeLab.get(getActivity());
//        List<Crime> crimes = crimeLab.getmCrimes();

//        mAdapter = new CrimeAdapter(crimes);
//        mCrimeRecyclerView.setAdapter(mAdapter);

        CrimeLab crimeLab = CrimeLab.get(getActivity());
        List<Crime> crimes = crimeLab.getmCrimes();

        if(mAdapter == null){
            mAdapter = new CrimeAdapter(crimes);
            mCrimeRecyclerView.setAdapter(mAdapter);
            Log.d("updateUI","mAdapter == null");
        } else {
//            mAdapter.notifyDataSetChanged();
            //excercise 1
            mAdapter.notifyItemChanged(click_index);
            Log.d("updateUI","mAdapter != null");
        }

    }

    private class CrimeHolder extends RecyclerView.ViewHolder
        implements View.OnClickListener{

        private  Crime mCrime;

        public TextView mTitleView;

        public TextView mDateTExtView;
        public CheckBox mSolvedCheckbox;

        public CrimeHolder(View itemView){
            super(itemView);
            itemView.setOnClickListener(this);
//            mTitleView = (TextView)itemView;

            mTitleView = (TextView)
                    itemView.findViewById(R.id.list_item_crime_title_text_view);
            mDateTExtView = (TextView)
                    itemView.findViewById(R.id.list_item_crime_date_text_view);
            mSolvedCheckbox = (CheckBox)
                    itemView.findViewById(R.id.list_item_crime_solved_check_box);

        }

        @Override
        public void onClick(View v){
//            Toast.makeText(getActivity(),
//                    mCrime.getmTitle() + " is being clicked!",
//                    Toast.LENGTH_SHORT)
//                    .show();
//            //start --------------自己测试加的代码：
//
//            int position = this.getAdapterPosition();
//            crimeLab.test_change(position);
//            Log.d("show mCrime:", mCrime.getmId().toString()+
//            " # "+ position);
//            // show recyclerview 's advantage
//            // http://www.cnblogs.com/tiantianbyconan/p/4232560.html
//            mCrimeRecyclerView.getAdapter().notifyItemChanged(position);
//            //end --------------自己测试加的代码：
            click_index = this.getAdapterPosition();
//            Intent intent = CrimeActivity.newIntent(getActivity(), mCrime.getmId());
            Intent intent = CrimePagerActivity.newIntent(getActivity(), mCrime.getmId());
            startActivity(intent);
        }

        public  void bindCrime(Crime crime){
            mCrime = crime;
            mTitleView.setText(mCrime.getmTitle());

            SimpleDateFormat sdf1 = new SimpleDateFormat();
            sdf1.applyPattern("yyyy/MM/dd HH:mm:ss.SS");
            String Dtstring=sdf1.format(mCrime.getmDate());

            mDateTExtView.setText(Dtstring);
//            mDateTExtView.setText((mCrime.getmDate().toString()));
            mSolvedCheckbox.setChecked(mCrime.ismSolved());
        }
    }

    private class CrimeAdapter extends RecyclerView.Adapter<CrimeHolder> {
        private List<Crime> mCrimes;
        public CrimeAdapter(List<Crime> crimes){
            mCrimes = crimes;
        }

        @Override
        public CrimeHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            LayoutInflater layoutInflater = LayoutInflater.from(getActivity());
//            View view = layoutInflater.inflate(android.R.layout.simple_list_item_1,
//                    parent, false);
              View view = layoutInflater.inflate(R.layout.list_item_crime,
                    parent, false);
            return new CrimeHolder(view);
        }

        @Override
        public void onBindViewHolder(CrimeHolder holder, int position) {
            Crime crime = mCrimes.get(position);
//            holder.mTitleView.setText(crime.getmTitle());
            holder.bindCrime(crime);
        }

        @Override
        public int getItemCount() {
            return mCrimes.size();
        }
    }
}
