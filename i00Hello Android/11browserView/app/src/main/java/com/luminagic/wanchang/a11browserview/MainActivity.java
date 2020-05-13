package com.luminagic.wanchang.a11browserview;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
// ...
import android.webkit.WebView;
// ...
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;
import android.util.Log;

import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {

    private EditText urlText;
    private Button goButton;
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Get a handle to all user interface elements
        urlText = (EditText) findViewById(R.id.url_field);
        goButton = (Button) findViewById(R.id.go_button);
        webView = (WebView) findViewById(R.id.web_view);

        // Setup event handlers
        goButton.setOnClickListener(new OnClickListener() {
            public void onClick(View view) {
                openBrowser();
            }
        });
        urlText.setOnEditorActionListener(new OnEditorActionListener() {
            public boolean onEditorAction(TextView v, int actionId,
                                          KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_GO) {
                    Log.d("@1", "something happen");
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
        webView.getSettings().setJavaScriptEnabled(true);
        // http://stackoverflow.com/questions/7305089/how-to-load-external-webpage-inside-webview
        webView.setWebViewClient(new WebViewClient() { });

        Log.d("@2", "something happen");
        webView.loadUrl(urlText.getText().toString());
    }
}
