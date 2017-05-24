package com.example.wanchang.a10fragment_argument;


import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.DatePicker;


import com.example.wanchang.a08fragment_layout.R;

import java.util.Date;
import java.util.GregorianCalendar;

public class BigPictureFragment  extends DialogFragment {



    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        View v = LayoutInflater.from(getActivity())
                .inflate(R.layout.dialog_bigpicture, null);

        return new android.support.v7.app.AlertDialog.Builder(getActivity())
                .setView(v)
                .setTitle(R.string.date_picker_title)
                .create();
    }

    public static BigPictureFragment newInstance(int i) {
        Bundle args = new Bundle();
//        args.putSerializable(ARG_DATE, date);
        BigPictureFragment fragment = new BigPictureFragment();
//        DatePickerFragment fragment = new DatePickerFragment();
        fragment.setArguments(args);
        return fragment;
    }
}
