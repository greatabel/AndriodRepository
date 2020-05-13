package com.luminagic.wanchang.a10connectingtotheworld;

import android.support.v7.app.AppCompatActivity;
//import android.os.Bundle;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;

public class MainActivity extends Activity {

    private EditText urlText;
    private Button goButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // get a handle to all user interface elements
        urlText = (EditText)findViewById(R.id.url_field);
        goButton = (Button)findViewById(R.id.go_button);

        goButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
               openBrowser();
            }
        });
        urlText.setOnEditorActionListener(new OnEditorActionListener() {
            public boolean onEditorAction(TextView v, int actionId,
                                          KeyEvent event) {
                if(actionId == EditorInfo.IME_ACTION_GO) {
                    openBrowser();
                    InputMethodManager imm = (InputMethodManager)
                            getSystemService(INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                    return true;
                }
                return false;
            }
        });

        
    }

    private void openBrowser() {
        Uri uri = Uri.parse(urlText.getText().toString());
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        startActivity(intent);
    }
}
