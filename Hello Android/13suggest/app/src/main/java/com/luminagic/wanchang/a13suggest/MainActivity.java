package com.luminagic.wanchang.a13suggest;

import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;

public class MainActivity extends AppCompatActivity {

    private EditText origText;
    private ListView suggList;
    private TextView ebandText;

    private Handler guiThread;
    private ExecutorService suggThread;
    private Runnable updateTask;
    private Future<?> suggPending;
    private List<String> items;
    private ArrayAdapter<String> adapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initThreading();
        findViews();
    }

    /**
     * Initialize multi-threading. There are two threads: 1) The main
     * graphical user interface thread already started by Android,
     * and 2) The suggest thread, which we start using an executor.
     */
    private void initThreading() {

    }

    private void findViews() {

    }

}
