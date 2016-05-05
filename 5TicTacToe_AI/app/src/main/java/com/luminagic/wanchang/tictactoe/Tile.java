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

    public Tile[] getSubTiles() {
        return mSubTiles;
    }

    public Tile deepCopy() {
        Tile tile = new Tile(mGame);
        tile.setOwner(getOwner());
        if (getSubTiles() != null) {
            Tile newTiles[] = new Tile[9];
            Tile oldTiles[] = getSubTiles();
            for (int child = 0; child < 9; child++) {
                newTiles[child] = oldTiles[child].deepCopy();
            }
            tile.setSubTiles(newTiles);
        }
        return tile;
    }


    public Tile(GameFragment game) {
        this.mGame = game;
    }


    public void setOwner(Owner owner) {
        this.mOwner = owner;
    }

    public void setSubTiles(Tile[] subTiles) {
        this.mSubTiles = subTiles;
    }

    public void setView(View view) {
        this.mView = view;
    }
    public Owner getOwner() {
        return mOwner;
    }
    public Owner findWinner() {
        // If owner already calculated, return it
        if (getOwner() != Owner.NEITHER)
            return getOwner();

        int totalX[] = new int[4];
        int totalO[] = new int[4];
        countCaptures(totalX, totalO);
        if (totalX[3] > 0) return Owner.X;
        if (totalO[3] > 0) return Owner.O;

        // Check for a draw
        int total = 0;
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 3; col++) {
                Owner owner = mSubTiles[3 * row + col].getOwner();
                if (owner != Owner.NEITHER) total++;
            }
            if (total == 9) return Owner.BOTH;
        }

        // Neither player has won this tile
        return Owner.NEITHER;
    }

    private void countCaptures(int totalX[], int totalO[]) {
        int capturedX, capturedO;
        // Check the horizontal
        for (int row = 0; row < 3; row++) {
            capturedX = capturedO = 0;
            for (int col = 0; col < 3; col++) {
                Owner owner = mSubTiles[3 * row + col].getOwner();
                if (owner == Owner.X || owner == Owner.BOTH) capturedX++;
                if (owner == Owner.O || owner == Owner.BOTH) capturedO++;
            }
            totalX[capturedX]++;
            totalO[capturedO]++;
        }

        // Check the vertical
        for (int col = 0; col < 3; col++) {
            capturedX = capturedO = 0;
            for (int row = 0; row < 3; row++) {
                Owner owner = mSubTiles[3 * row + col].getOwner();
                if (owner == Owner.X || owner == Owner.BOTH) capturedX++;
                if (owner == Owner.O || owner == Owner.BOTH) capturedO++;
            }
            totalX[capturedX]++;
            totalO[capturedO]++;
        }

        // Check the diagonals
        capturedX = capturedO = 0;
        for (int diag = 0; diag < 3; diag++) {
            Owner owner = mSubTiles[3 * diag + diag].getOwner();
            if (owner == Owner.X || owner == Owner.BOTH) capturedX++;
            if (owner == Owner.O || owner == Owner.BOTH) capturedO++;
        }
        totalX[capturedX]++;
        totalO[capturedO]++;
        capturedX = capturedO = 0;
        for (int diag = 0; diag < 3; diag++) {
            Owner owner = mSubTiles[3 * diag + (2 - diag)].getOwner();
            if (owner == Owner.X || owner == Owner.BOTH) capturedX++;
            if (owner == Owner.O || owner == Owner.BOTH) capturedO++;
        }
        totalX[capturedX]++;
        totalO[capturedO]++;
    }

    public int evaluate() {
        switch (getOwner()) {
            case X:
                return 100;
            case O:
                return -100;
            case NEITHER:
                int total = 0;
                if (getSubTiles() != null) {
                    for (int tile = 0; tile < 9; tile++) {
                        total += getSubTiles()[tile].evaluate();
                    }
                    int totalX[] = new int[4];
                    int totalO[] = new int[4];
                    countCaptures(totalX, totalO);
                    total = total * 100 + totalX[1] + 2 * totalX[2] + 8 *
                            totalX[3] - totalO[1] - 2 * totalO[2] - 8 * totalO[3];
                }
                return total;
        }
        return 0;
    }

}