package com.example.wanchang.a10fragment_argument;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.support.v4.app.Fragment;
import android.os.Bundle;
import android.support.v4.app.FragmentManager;
import android.text.Editable;
import android.text.TextWatcher;
import android.text.format.DateFormat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

import com.example.wanchang.a08fragment_layout.R;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;


public class CrimeFragment extends Fragment {

    private static final String ARG_CRIME_ID = "crime_id";

    private static final String DIALOG_DATE = "DialogDate";

    private static final String DIALOG_TIME = "DialogTime";

    private static final int REQUEST_DATE = 0;



    private static final  int REQUEST_TIME = 1;

    private static final int REQUEST_CONTACT = 2;
    private Crime mCrime;



    private EditText mTitleField;
    private Button mDateButton;

    private Button mTimeButton;

    private CheckBox mSolvedCheckBox;

    private Button mSuspectButton;


    private Button mReportButton;

    public  static CrimeFragment newInstance(UUID crimeId) {
        Bundle args = new Bundle();
        args.putSerializable(ARG_CRIME_ID, crimeId);

        CrimeFragment fragment = new CrimeFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        mCrime = new Crime();
//        UUID crimeId = (UUID)getActivity().getIntent()
//                .getSerializableExtra(CrimeActivity.EXTRA_CRIME_ID);
        UUID crimeId = (UUID)getArguments().getSerializable(ARG_CRIME_ID);

        Log.d("EXTRA_CRIME_ID=", CrimeActivity.EXTRA_CRIME_ID);
        mCrime = CrimeLab.get(getActivity()).getCrime(crimeId);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState){
        View v = inflater.inflate(R.layout.fragment_crime, container, false);


        mTitleField = (EditText)v.findViewById(R.id.crime_title);
        mTitleField.setText(mCrime.getmTitle());
        mTitleField.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                mCrime.setmTitle(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

        mDateButton = (Button)v.findViewById(R.id.crime_date);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateFormat = formatter.format(mCrime.getmDate());
//        String dateAndroid = android.text.format.DateFormat.format(
//                "yyyy-dd-MM", mCrime.getmDate()).toString();
        mDateButton.setText(dateFormat);

//        mDateButton.setEnabled(false);
        mDateButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                FragmentManager manager = getFragmentManager();
//                DatePickerFragment dialog = new DatePickerFragment();
                DatePickerFragment dialog = DatePickerFragment
                        .newInstance(mCrime.getmDate());
                dialog.setTargetFragment(CrimeFragment.this, REQUEST_DATE);
                dialog.show(manager, DIALOG_DATE);
            }

        });

        // http://stackoverflow.com/questions/6842245/converting-date-time-to-24-hour-format

        mTimeButton = (Button)v.findViewById(R.id.crime_time);
        String timeAndroid = android.text.format.DateFormat.format(
                "kk:mm:ss", mCrime.getmDate()).toString();
        mTimeButton.setText(timeAndroid);
        mTimeButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                FragmentManager manager = getFragmentManager();
//                TimePickerFragment dialog = new TimePickerFragment();
                TimePickerFragment dialog =  TimePickerFragment
                        .newInstance(mCrime.getmDate());

                dialog.setTargetFragment(CrimeFragment.this, REQUEST_TIME);

                dialog.show(manager, DIALOG_TIME);
            }
        });
        updateDate();

        mSolvedCheckBox = (CheckBox)v.findViewById(R.id.crime_solved);
        mSolvedCheckBox.setChecked(mCrime.ismSolved());
        mSolvedCheckBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                mCrime.setmSolved(isChecked);
            }
        });

        mReportButton = (Button)v.findViewById(R.id.crime_report);
        mReportButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                Intent i = new Intent(Intent.ACTION_SEND);
                i.setType("text/plain");
                i.putExtra(Intent.EXTRA_TEXT, getCrimeReport());
                i.putExtra(Intent.EXTRA_SUBJECT, getString(R.string.crime_report_subject));

                i = Intent.createChooser(i, getString(R.string.send_report));
                startActivity(i);
            }
        });

        final Intent pickContact = new Intent(Intent.ACTION_PICK,
                ContactsContract.Contacts.CONTENT_URI);
        
        // 过滤器测试
//        pickContact.addCategory(Intent.CATEGORY_HOME);
        // ---

        mSuspectButton = (Button)v.findViewById(R.id.crime_suspect);
        mSuspectButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                startActivityForResult(pickContact, REQUEST_CONTACT);
            }
        });
        if(mCrime.getmSuspect() != null){
            mSuspectButton.setText(mCrime.getmSuspect());
        }

        // 防止崩溃，检查是否存在联系人应用
        PackageManager packageManager = getActivity().getPackageManager();
        if(packageManager.resolveActivity(pickContact,
                PackageManager.MATCH_DEFAULT_ONLY) == null ){
            mSuspectButton.setEnabled(false);
        }

        return v;

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){
        Log.d("onActivityResult->", Integer.toString(requestCode));
        if(resultCode != Activity.RESULT_OK) {
            return ;
        }
        if(requestCode == REQUEST_DATE) {
            Date date = (Date)data
                    .getSerializableExtra(DatePickerFragment.EXTRA_DATE);
            mCrime.setmDate(date);
            updateDate();
        }
        if(requestCode == REQUEST_TIME) {
            Date part_date = (Date)data
                    .getSerializableExtra(TimePickerFragment.EXTRA_TIME);
            Log.d("onActivityResult->", part_date.toString());
            mCrime.setmDate_Hour_Minute_Part(part_date);
            updateDate();
        }
        if ( requestCode == REQUEST_CONTACT && data != null){
            Uri contactUri = data.getData();
            String[] queryFields = new String[] {
                    ContactsContract.Contacts.DISPLAY_NAME
            };
            Cursor c = getActivity().getContentResolver()
                    .query(contactUri, queryFields, null, null, null);
            try {
                if (c.getCount() == 0) {
                    return;
                }
                c.moveToFirst();
                String suspect = c.getString(0);
                mCrime.setmSuspect(suspect);
                mSuspectButton.setText(suspect);
            } finally {
                c.close();;
            }
        }
    }

    private void updateDate() {
        // http://stackoverflow.com/questions/14039062/how-to-convert-date-in-to-yyyy-mm-dd-format
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateFormat = formatter.format(mCrime.getmDate());
        mDateButton.setText(dateFormat);

        String timeAndroid = android.text.format.DateFormat.format(
                "kk:mm:ss", mCrime.getmDate()).toString();
        mTimeButton.setText(timeAndroid);
    }

    private String getCrimeReport() {
        String solvedString = null;
        if (mCrime.ismSolved()) {
            solvedString = getString(R.string.crime_report_solved);
        } else {
            solvedString = getString(R.string.crime_report_unsolved);
        }
        String dateFormat = "EEE, MMM dd";
        String dateString = DateFormat.format(dateFormat, mCrime.getmDate()).toString();
        String suspect = mCrime.getmSuspect();
        if (suspect == null) {
            suspect = getString(R.string.crime_report_no_suspect);
        } else {
            suspect = getString(R.string.crime_report_suspect, suspect);
        }
        String report = getString(R.string.crime_report,
                mCrime.getmTitle(), dateString, solvedString, suspect);
        return report;
    }

    @Override
    public void onPause(){
        super.onPause();
        CrimeLab.get(getActivity())
                .updateCrime(mCrime);
    }
}
