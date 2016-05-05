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

    private int mLastLarge;
    private int mLastSmall;

    private Tile mSmallTiles[][] = new Tile[9][9];

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
        initGame();
    }

    public void initGame() {
        Log.d("UT3", "init game");
    }

    public void putState(String gameData) {
        String[] fields = gameData.split(",");
        int index = 0;
        mLastLarge = Integer.parseInt(fields[index++]);
        mLastSmall = Integer.parseInt(fields[index++]);
        for (int large = 0; large < 9; large++) {
            for (int small = 0; small < 9; small++) {
                Tile.Owner owner = Tile.Owner.valueOf(fields[index++]);
                mSmallTiles[large][small].setOwner(owner);
            }
        }
        setAvailableFromLastMove(mLastSmall);
        updateAllTiles();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView =
                inflater.inflate(R.layout.large_board, container, false);
        initViews(rootView);
        updateAllTiles();
        return rootView;
    }

    private void initViews(View rootView) {

    }

    public void restartGame() {
//        mSoundPool.play(mSoundRewind, mVolume, mVolume, 1, 0, 1f);
//        // ...
//        initGame();
        initViews(getView());
        updateAllTiles();
    }

    private void setAvailableFromLastMove(int small) {

    }

    private void updateAllTiles() {

    }
}
