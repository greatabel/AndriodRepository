package com.mygdx.game;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.graphics.GL20;

import com.badlogic.gdx.Game;
import com.mygdx.Screens.GameScreen;
import com.mygdx.ZBHelpers.AssetLoader;

/**
 * main structure of game procedure
 */
public class MyGdxGame extends Game {
    ShapeRenderer shape;

    @Override
    public void create() {

//		shape = new ShapeRenderer();
        System.out.println("Flappy Bird Game Created!");
        AssetLoader.load();
        setScreen(new GameScreen());
    }


    @Override
    public void dispose() {
        super.dispose();
        AssetLoader.dispose();
    }

}