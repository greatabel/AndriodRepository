package com.luminagic.a18beatbox;

import android.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class BeatBoxActivity extends SingleFragmentActivity {

    @Override
    protected Fragment createFragment() {
        return BeatBoxFragment.newInstance();
    }
}
