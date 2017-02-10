package com.luminagic.wanchang.a13suggest;

import android.app.SearchManager;
import android.content.Intent;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.text.method.LinkMovementMethod;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import android.widget.AdapterView.OnItemClickListener;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.RejectedExecutionException;

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
        setListeners();
        setAdapters();
    }

    @Override
    protected void onDestroy() {
        // Terminate extra threads here
        suggThread.shutdownNow();
        super.onDestroy();
    }

    /**
     * Initialize multi-threading. There are two threads: 1) The main
     * graphical user interface thread already started by Android,
     * and 2) The suggest thread, which we start using an executor.
     */
    private void initThreading() {
        guiThread = new Handler();
        suggThread = Executors.newSingleThreadExecutor();

        // this task get suggestions and updates the screen
        updateTask = new Runnable() {

            public void run() {
                String original = origText.getText().toString().trim();

                if(suggPending != null)
                    suggPending.cancel(true);

                if (original.length() != 0) {
                    // Let user know we're doing something
                    setText(R.string.working);

                    // Begin suggestion now but don't wait for it
                    try {
                        SuggestTask suggestTask = new SuggestTask(
                                MainActivity.this, // reference to activity
                                original // original text
                        );
                        suggPending = suggThread.submit(suggestTask);
                    } catch (RejectedExecutionException e) {
                        // Unable to start new task
                        setText(R.string.error);
                    }
                }

            }
        };
    }

    /** Display a list */
    private void setList(List<String> list) {
        adapter.clear();
        adapter.addAll(list);
    }
    /** All changes to the GUI must be done in the GUI thread */
    private void guiSetList(final ListView view,
                            final List<String> list) {
        guiThread.post(new Runnable() {
            public void run() {
                setList(list);
            }

        });
    }

    public void setSuggestions(List<String> suggestions) {
        guiSetList(suggList, suggestions);
    }

    private void setText(int id) {
        adapter.clear();
        adapter.add(getResources().getString(id));
    }

    private void findViews() {
        origText = (EditText)findViewById(R.id.original_text);
        suggList = (ListView)findViewById(R.id.result_list);
        ebandText = (TextView)findViewById(R.id.eband_text);
    }

    private void setListeners() {
     // Define listener for text change
        TextWatcher textWatcher = new TextWatcher() {

            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }


            public void onTextChanged(CharSequence s, int start, int count, int after) {
                queueUpdate(1000 /* milliseconde */);
            }

            public void afterTextChanged(Editable editable) {

            }
        };
        origText.addTextChangedListener(textWatcher);

        OnItemClickListener clickListener = new OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                String query = (String) parent.getItemAtPosition(position);
                doSearch(query);
            }
        };


        // Set listener on the suggestion list
        suggList.setOnItemClickListener(clickListener);

        // Make website link clickable
        ebandText.setMovementMethod(LinkMovementMethod.getInstance());
    }

    private  void queueUpdate(long delayMillis) {
        guiThread.removeCallbacks(updateTask);
        guiThread.postDelayed(updateTask, delayMillis);
    }
    private void doSearch(String query) {
        Intent intent = new Intent(Intent.ACTION_WEB_SEARCH);
        intent.putExtra(SearchManager.QUERY, query);
        startActivity(intent);
    }


    private void setAdapters() {

        items = new ArrayList<String>();
        adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1,
                items);
        suggList.setAdapter(adapter);
    }

}
