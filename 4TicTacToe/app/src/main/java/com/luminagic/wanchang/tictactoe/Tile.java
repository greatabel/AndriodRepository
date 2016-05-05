package com.luminagic.wanchang.tictactoe;

import android.app.AlertDialog;
import android.app.Fragment;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

public class Tile  {


    public enum Owner {
        X, O /* letter O */, NEITHER, BOTH
    }

    private final GameFragment mGame;
    private Owner mOwner = Owner.NEITHER;
    private View mView;
    private Tile mSubTiles[];

    public Tile(GameFragment game) {
        this.mGame = game;
    }


    public void setOwner(Owner owner) {
        this.mOwner = owner;
    }

}