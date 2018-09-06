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
import java.util.Random;


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
        textView = (TextView)findViewById(R.id.text_view);
        button = (Button)findViewById(R.id.button);

        //Turn on Javascript in the embedded browser
        webView.getSettings().setJavaScriptEnabled(true);


        //调用JS方法.安卓版本大于17,加上注解 @JavascriptInterface
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(true);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        webView.getSettings().setSupportMultipleWindows(true);

        // load the web page from a local asset
        webView.loadUrl("file:///android_asset/local/ST/differentGirl/index.html");

        // expose a Java object to javascript in the browser
        webView.addJavascriptInterface(new AndroidBridge(),"android");

        // Set up a function to be called when JavaScript tries
        // to open an alert window
        webView.setWebChromeClient(new WebChromeClient(){
            @Override
            public boolean onJsAlert(final WebView view,
                                     final  String url, final  String message, JsResult result) {
                Log.d(TAG, "onJsAlert(" + view + ", " + url + ", "
                        + message + ", " + result + ")");
                Toast.makeText(MainActivity.this, message+" @-@", Toast.LENGTH_LONG).show();
                result.confirm();
                return true; // I handled it
            }
        });

        button.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, "onClick(" + v + ")");
                //note a single Random object is reused here
                Random randomGenerator = new Random();
                int randomInt = randomGenerator.nextInt(1000);
                webView.loadUrl("javascript:callJS('Hello from Android."+randomInt+ "')");
            }
        });
    }


}
