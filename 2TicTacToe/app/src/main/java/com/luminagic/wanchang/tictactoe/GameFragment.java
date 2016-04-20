package com.luminagic.wanchang.tictactoe;

//import android.support.v7.app.AppCompatActivity;
import android.app.Activity;
import android.os.Bundle;

import android.app.Fragment;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import java.util.HashSet;
import java.util.Set;

public class GameFragment extends Fragment {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
        InitGame();
    }

    public void InitGame() {
        Log.d("UT3", "init game");
    }
}
