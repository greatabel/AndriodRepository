package com.example.wanchang.a10fragment_argument;


import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.DatePicker;
import android.widget.ImageView;


import com.example.wanchang.a08fragment_layout.R;

import java.util.Date;
import java.util.GregorianCalendar;

public class BigPictureFragment  extends DialogFragment {

    private static final String ARG_BIGPicture = "BigPicture";

    private ImageView mBigPhotoView;
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {


        String path = getArguments().getSerializable(ARG_BIGPicture).toString();

        View v = LayoutInflater.from(getActivity())
                .inflate(R.layout.dialog_bigpicture, null);

        mBigPhotoView = (ImageView)v.findViewById(R.id.crime_bigphoto);
        Bitmap bitmap = PictureUtils.getScaledBitmap(path,getActivity());
        mBigPhotoView.setImageBitmap(bitmap);

        return new android.support.v7.app.AlertDialog.Builder(getActivity())
                .setView(v)
                .setTitle(R.string.bigpicture_title)
                .create();
    }

    public static BigPictureFragment newInstance(String path) {


        Bundle args = new Bundle();
        args.putSerializable(ARG_BIGPicture, path);
        BigPictureFragment fragment = new BigPictureFragment();
//        DatePickerFragment fragment = new DatePickerFragment();
        fragment.setArguments(args);
        return fragment;
    }
}
