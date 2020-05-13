package com.luminagic.wanchang.a16event;

import android.app.ListActivity;
import android.app.LoaderManager;
import android.content.ContentValues;
import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.os.Bundle;
import android.widget.SimpleCursorAdapter;

import com.google.android.gms.common.api.GoogleApiClient;
import com.luminagic.wanchang.a15event.R;

import static android.provider.BaseColumns._ID;
import static com.luminagic.wanchang.a16event.Constants.CONTENT_URI;
import static com.luminagic.wanchang.a16event.Constants.TIME;
import static com.luminagic.wanchang.a16event.Constants.TITLE;


public class MainActivity extends ListActivity implements
        LoaderManager.LoaderCallbacks<Cursor> {

    private final static int LOADER_ID = 1;

    private SimpleCursorAdapter mAdapter;


    private static String[] FROM = {_ID, TIME, TITLE,};
    private static String ORDER_BY = TIME + " DESC";
//    private EventsData events;

    private static int[] TO = {R.id.rowid, R.id.time, R.id.title,};
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

//        addEvent("Hello, Android!");
//        Cursor cursor = getEvents();
//        showEvents(cursor);
        mAdapter = new SimpleCursorAdapter(this, R.layout.item, null,
                FROM, TO, 0);
        setListAdapter(mAdapter);

        LoaderManager lm = getLoaderManager();
        lm.initLoader(LOADER_ID, null, this);

        addEvent("Test loader");
    }

    private void addEvent(String string) {
        // Insert a new record into the Events data source.
        // You would do something similar for delete and update.
//        SQLiteDatabase db = events.getWritableDatabase();
//        ContentValues values = new ContentValues();
//        values.put(TIME, System.currentTimeMillis());
//        values.put(TITLE, string);
//        db.insertOrThrow(TABLE_NAME, null, values);
        ContentValues values = new ContentValues();
        values.put(TIME, System.currentTimeMillis());
        values.put(TITLE, string);
        getContentResolver().insert(CONTENT_URI, values);
    }

    @Override
    public Loader<Cursor> onCreateLoader(int id, Bundle args) {
        // Create a new CursorLoader
        return new CursorLoader(this, CONTENT_URI, FROM, null, null, ORDER_BY);
    }

    @Override
    public void onLoadFinished(Loader<Cursor> loader, Cursor cursor) {
        switch (loader.getId()) {
            case LOADER_ID:
                // The data is now available to use
                mAdapter.swapCursor(cursor);
                break;
        }
    }

    @Override
    public void onLoaderReset(Loader<Cursor> loader) {
        // The loader's data is unavailable
        mAdapter.swapCursor(null);
    }
//    private Cursor getEvents() {
//        // Perform a managed query. The Activity will handle closing
//        // and re-querying the cursor when needed.
////        SQLiteDatabase db = events.getReadableDatabase();
////        Cursor cursor = db.query(TABLE_NAME, FROM, null, null, null,
////                null, ORDER_BY);
////        startManagingCursor(cursor);
////        return cursor;
//        return managedQuery(CONTENT_URI, FROM, null,null, ORDER_BY);
//    }

    //    private void showEvents(Cursor cursor){
//        StringBuilder builder = new StringBuilder("Saved Events:\n");
//        while(cursor.moveToNext()){
//            long id = cursor.getLong(0);
//            long time = cursor.getLong(1);
//            String title = cursor.getString(2);
//            builder.append(id).append(": ");
//            builder.append(time).append(": ");
//            builder.append(title).append("\n");
//
//        }
//        // Display on the screen
//        TextView text = (TextView) findViewById(R.id.text);
//        text.setText(builder);
//
//    }
//    private void showEvents(Cursor cursor) {
//        // Set up data binding
//        SimpleCursorAdapter adapter = new SimpleCursorAdapter(this,
//                R.layout.item, cursor, FROM, TO);
//        setListAdapter(adapter);
//    }


}
