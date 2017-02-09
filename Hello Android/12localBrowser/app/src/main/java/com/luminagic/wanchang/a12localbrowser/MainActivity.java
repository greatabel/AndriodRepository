package com.luminagic.wanchang.a12localbrowser;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

    private static final String TAG = "LocalBrowser";
    private final Handler handler = new Handler();
    private WebView webView;
    private TextView textView;
    private Button button;

    private class AndroidBridge {
        @JavascriptInterface
        public void callAndroid(final String arg) {
            handler.post(new Runnable() {
                @Override
                public void run() {
                    Log.d(TAG, "callAndroid" + arg + ")");
                    textView.setText(arg);
                }
            });
        }

    }




    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = (WebView)findViewById(R.id.web_view);
        // load the web page from a local asset
        webView.loadUrl("file:///android_asset/index.html");
    }
}
