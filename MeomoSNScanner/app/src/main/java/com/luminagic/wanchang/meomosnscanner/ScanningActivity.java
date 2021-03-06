package com.luminagic.wanchang.meomosnscanner;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceView;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import com.bottlerocketstudios.barcode.detection.controller.ZXingFacade;
import com.bottlerocketstudios.barcode.detection.controller.ZXingFacadeListener;
import com.bottlerocketstudios.barcode.detection.model.ZXingConfiguration;
import com.google.zxing.Result;

import java.util.concurrent.TimeUnit;

public class ScanningActivity extends Activity {
    private static final String TAG = ScanningActivity.class.getSimpleName();

    private TextView mStatusText;
    private SurfaceView mPreview;
    private ZXingFacade mZXingFacade;


    /* abel add */
    private static final String EXTRA_ABEL_SN =
            "com.luminagic.wanchang.meomosnscanner.sn";

    public static Intent newIntent(Context packageContext) {
        Intent i = new Intent(packageContext, ScanningActivity.class);
        return i;
    }

    public static String getSnResult(Intent result) {
        return result.getStringExtra(EXTRA_ABEL_SN);
    }

    private void setSnResult(String SN) {
        Intent data = new Intent();
        data.putExtra(EXTRA_ABEL_SN, SN);
        setResult(Activity.RESULT_OK, data);
    }

    /* end abel add */


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.scanning_activity);

        mPreview = (SurfaceView) findViewById(R.id.zxing_preview_surface);
        mStatusText = (TextView) findViewById(R.id.zxing_status_text);

        initFacade();
    }

    private void initFacade() {
        ZXingConfiguration zXingConfiguration = ZXingConfiguration.createDefaultConfiguration(true, true);
        mZXingFacade = new ZXingFacade(this, zXingConfiguration, mZXingFacadeListener);
        mZXingFacade.onCreate(mPreview);
    }

    @Override
    protected void onResume() {
        super.onResume();
        mZXingFacade.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mZXingFacade.onPause();
    }

    private ZXingFacadeListener mZXingFacadeListener = new ZXingFacadeListener() {
        @Override
        public void handleDecode(Result result, Bitmap barcode, float scaleFactor) {
            Log.d(TAG, "Decoded: " + result.getText());
            mStatusText.setText(result.getText());
            setSnResult(result.getText());
            mZXingFacade.restartPreviewAfterDelay(TimeUnit.SECONDS.toMillis(1));
        }

        @Override
        public void onZXingException(Throwable t) {
            Log.e(TAG, "Exception thrown by ZXing", t);
        }
    };
}
