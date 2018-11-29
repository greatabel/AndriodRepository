package com.luminagic.wanchang.a12localbrowser;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
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
import android.content.pm.ActivityInfo;

public class MainActivity extends Activity {

    private static final String TAG = "LocalBrowser";
    private final Handler handler = new Handler();
    private WebView webView;
    private WebView webViewR;
    static String pathloacl = "";
//    private TextView textView;
//    private Button button;

    public static Intent newIntent(Context packageContext) {
        Intent i = new Intent(packageContext, MainActivity.class);

        return i;
    }

    private class AndroidBridge {
        @JavascriptInterface
        public void callAndroid(final String arg) {
            handler.post(new Runnable() {
                @Override
                public void run() {
                    Log.d(TAG, "callAndroid" + arg + ")");
//                    textView.setText(arg);
                }
            });
        }

    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        setContentView(R.layout.activity_main);

        webView = (WebView)findViewById(R.id.web_view);
        webViewR = (WebView)findViewById(R.id.web_viewR);
//        textView = (TextView)findViewById(R.id.text_view);
//        button = (Button)findViewById(R.id.button);

        //Turn on Javascript in the embedded browser
        webView.getSettings().setJavaScriptEnabled(true);


        //调用JS方法.安卓版本大于17,加上注解 @JavascriptInterface
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowFileAccessFromFileURLs(true);
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        webView.getSettings().setSupportMultipleWindows(true);

        webView.getSettings().setAppCacheMaxSize( 10 * 1024 * 1024 ); // 10MB
        webView.getSettings().setAppCachePath(getApplicationContext().getCacheDir().getAbsolutePath() );
        webView.getSettings().setAllowFileAccess( true );
        webView.getSettings().setAppCacheEnabled( true );
        webView.getSettings().setJavaScriptEnabled( true );
//        webView.getSettings().setCacheMode( WebSettings.LOAD_DEFAULT );

        Intent intent = getIntent();
        pathloacl = intent.getStringExtra("key");

        String webView_url = "file:///android_asset/local/" + pathloacl;
        Log.d("test",webView_url);
        // load the web page from a local asset
//        webView.getSettings().setUseWideViewPort(true);
//        webView.getSettings().setLoadWithOverviewMode(true);
        webView.loadUrl(webView_url);

        //---------第二个webview------
        //Turn on Javascript in the embedded browser
        webViewR.getSettings().setJavaScriptEnabled(true);


        //调用JS方法.安卓版本大于17,加上注解 @JavascriptInterface
        webViewR.getSettings().setJavaScriptEnabled(true);
        webViewR.getSettings().setAllowFileAccess(true);
        webViewR.getSettings().setAllowFileAccessFromFileURLs(true);
        webViewR.getSettings().setAllowUniversalAccessFromFileURLs(true);
        webViewR.getSettings().setSupportMultipleWindows(true);

//        webViewR.getSettings().setUseWideViewPort(true);
//        webViewR.getSettings().setLoadWithOverviewMode(true);
        // load the web page from a local asset
        webViewR.loadUrl(webView_url);


        //--------------------------
        // expose a Java object to javascript in the browser
        webView.addJavascriptInterface(new AndroidBridge(),"android");

        // Set up a function to be called when JavaScript tries
        // to open an alert window
//        webView.setWebChromeClient(new WebChromeClient(){
//            @Override
//            public boolean onJsAlert(final WebView view,
//                                     final  String url, final  String message, JsResult result) {
//                Log.d(TAG, "onJsAlert(" + view + ", " + url + ", "
//                        + message + ", " + result + ")");
//                Toast.makeText(MainActivity.this, message+" @-@", Toast.LENGTH_LONG).show();
//                result.confirm();
//                return true; // I handled it
//            }
//        });

//        button.setOnClickListener(new OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                Log.d(TAG, "onClick(" + v + ")");
//                //note a single Random object is reused here
//                Random randomGenerator = new Random();
//                int randomInt = randomGenerator.nextInt(1000);
//                webView.loadUrl("javascript:callJS('Hello from Android."+randomInt+ "')");
//            }
//        });
    }


}
