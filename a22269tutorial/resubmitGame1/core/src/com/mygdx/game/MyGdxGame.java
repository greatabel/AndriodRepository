package com.mygdx.game;
import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.graphics.GL20;

public class MyGdxGame extends ApplicationAdapter {
	ShapeRenderer shape;

	@Override
	public void create () {
		shape = new ShapeRenderer();
	}

	@Override
	public void render () {
		shape.begin(ShapeRenderer.ShapeType.Filled);
		shape.circle(50, 50, 50);
		shape.end();
	}
}