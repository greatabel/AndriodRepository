package com.luminagic.wanchang.a12localbrowser;

import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import org.json.JSONArray;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.widget.ListView;

import java.io.InputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONObject;
import org.json.JSONException;

// http://www.vogella.com/tutorials/AndroidListView/article.html#listactivity
public class GameListActivity extends ListActivity {

    String[] values = new String[] { "Android", "iPhone", "WindowsMobile",
            "Blackberry", "WebOS", "Ubuntu", "Windows7", "Max OS X",
            "Linux", "OS/2" };
    ArrayList<String> mylist = new ArrayList<String>();
    JSONArray results = null;

    public String readJSONFromAsset() {
        String json = null;
        try {
            InputStream is = getAssets().open("local/router.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        return json;
    }

    public void onCreate(Bundle icicle) {
        super.onCreate(icicle);
        String routerJsonPath = "file:///android_asset/local/router.json";
        JSONObject obj = null;
        try {
             obj = new JSONObject(readJSONFromAsset());
        } catch (JSONException ex){
            ex.printStackTrace();
        }
        try {

            results = (JSONArray) obj.get("gamelist");
            for(int i=0;i<results.length();i++) {
                mylist.add(results.getJSONObject(i).getString("fullname"));
            }
//            AlertDialog alertDialog = new AlertDialog.Builder(GameListActivity.this).create();
//            alertDialog.setTitle("Alert");
//            alertDialog.setMessage( results.getJSONObject(0).getString("fullname").toString());
//            alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
//                    new DialogInterface.OnClickListener() {
//                        public void onClick(DialogInterface dialog, int which) {
//                            dialog.dismiss();
//                        }
//                    });
//            alertDialog.show();

        } catch (JSONException e) {
            e.printStackTrace();
        }



//        Log.d("test",obj.toString());

//        AlertDialog alertDialog = new AlertDialog.Builder(GameListActivity.this).create();
//        alertDialog.setTitle("Alert");
//        try {
//            alertDialog.setMessage(obj.get("gamelist").toString());
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
//        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
//                new DialogInterface.OnClickListener() {
//                    public void onClick(DialogInterface dialog, int which) {
//                        dialog.dismiss();
//                    }
//                });
//        alertDialog.show();


        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,
                android.R.layout.simple_list_item_1, mylist);
        setListAdapter(adapter);
    }

    @Override
    protected void onListItemClick(ListView l, View v, int position, long id)
    {
        super.onListItemClick(l, v, position, id);
//        Log.d("cardNumber", values.get(position).getCardNumber());
//        AlertDialog alertDialog = new AlertDialog.Builder(GameListActivity.this).create();
//        alertDialog.setTitle("Alert");
        String pathloacl = "";
        try {
            pathloacl = results.getJSONObject(position).getString("pathloacl").toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
//        alertDialog.setMessage( Integer.toString(position) + pathloacl);
//        alertDialog.setButton(AlertDialog.BUTTON_NEUTRAL, "OK",
//                new DialogInterface.OnClickListener() {
//                    public void onClick(DialogInterface dialog, int which) {
//                        dialog.dismiss();
//                    }
//                });
//        alertDialog.show();

        Intent i = new Intent(this, MainActivity.class);
        i.putExtra("key", pathloacl);
        startActivityForResult(i, position);
    }

}