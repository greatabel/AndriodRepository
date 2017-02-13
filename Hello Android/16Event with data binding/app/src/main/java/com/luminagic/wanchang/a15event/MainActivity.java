package com.luminagic.wanchang.a15event;

import android.app.ListActivity;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.widget.SimpleCursorAdapter;

import static android.provider.BaseColumns._ID;
import static com.luminagic.wanchang.a15event.Constants.TABLE_NAME;
import static com.luminagic.wanchang.a15event.Constants.TIME;
import static com.luminagic.wanchang.a15event.Constants.TITLE;


public class MainActivity extends ListActivity {

    private  static String[] FROM = {_ID, TIME, TITLE,};
    private static String ORDER_BY = TIME + " DESC";
    private EventsData events;

    private static int[] TO = { R.id.rowid, R.id.time, R.id.title, };
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        events = new EventsData(this);
        int i = 0;
        try {
            Log.w("log","i= " +(++i));

            addEvent("Hello, Android from abel");
            Cursor cursor = getEvents();
            showEvents(cursor);
        } finally {
            events.close();
        }

    }

    private void addEvent(String string) {
        // Insert a new record into the Events data source.
        // You would do something similar for delete and update.
        SQLiteDatabase db = events.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(TIME, System.currentTimeMillis());
        values.put(TITLE, string);
        db.insertOrThrow(TABLE_NAME, null, values);
    }

    private Cursor getEvents() {
        // Perform a managed query. The Activity will handle closing
        // and re-querying the cursor when needed.
        SQLiteDatabase db = events.getReadableDatabase();
        Cursor cursor = db.query(TABLE_NAME, FROM, null, null, null,
                null, ORDER_BY);
        startManagingCursor(cursor);
        return cursor;
    }

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
    private void showEvents(Cursor cursor) {
    // Set up data binding
    SimpleCursorAdapter adapter = new SimpleCursorAdapter(this,
            R.layout.item, cursor, FROM, TO);
    setListAdapter(adapter);
    }
}
