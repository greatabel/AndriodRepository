package com.luminagic.a18beatbox;

import android.util.Log;

import java.util.Arrays;

public class Sound {
    private String mAssetPath;
    private String mName;

    // ch19
    private Integer mSoundId;

    public Integer getmSoundId() {
        return mSoundId;
    }

    public void setmSoundId(Integer mSoundId) {
        this.mSoundId = mSoundId;
    }



    public Sound(String assetPath){
        mAssetPath = assetPath;
        String[] components = assetPath.split("/");
        String str = Arrays.toString(components);
//        Log.d("Sound->", str);
        String filename = components[components.length -1];
//        Log.d("filename->", filename);
        mName = filename.replace(".wav", "");
    }

    public String getAssetPath() {
        return mAssetPath;
    }

    public  String getName() {
        return mName;
    }
}
