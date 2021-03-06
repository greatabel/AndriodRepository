package com.luminagic.wanchang.meomosnscanner;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = MainActivity.class.getSimpleName();

    private static final int REQUEST_CODE_CAMERA_PERMISSION = 128;
    private String splitLine = " <-@@@@@@@@@@@-> ";

    /* abel add */
    private TextView mShowTextView;
    private Button mExportButton;
    private Button mScanButton;
    private static final int REQUEST_CODE_SN = 0;
    private String mSN ;
    ArrayList<String> snlist = new ArrayList<String>();

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if(resultCode != Activity.RESULT_OK) {
            return ;
        }
        if(requestCode == REQUEST_CODE_SN){
            if(data == null){
                return;
            }

            mSN = ScanningActivity.getSnResult(data);

            String SN=mSN.replaceFirst(".*/(\\w+)*","$1");
            Log.d(TAG,"str="+SN);

            snlist.add(SN);
            mShowTextView.setText("入库个数：" + snlist.size()+
                    " 最后一个："+snlist.get(snlist.size()-1));

        }

    }
    /* end of abel add */

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mShowTextView = (TextView)findViewById(R.id.show_text_view);

        mExportButton = (Button)findViewById(R.id.export_button);
        mExportButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, splitLine+"mExportButton");
                String contentToSend = android.text.TextUtils.join("\n", snlist);
                Intent sendIntent = new Intent();
                sendIntent.setAction(Intent.ACTION_SEND);
                sendIntent.putExtra(Intent.EXTRA_TEXT, contentToSend);
                sendIntent.setType("text/plain");
                startActivity(Intent.createChooser(sendIntent, "file_send"));
            }
        });
        mScanButton = (Button)findViewById(R.id.scan_button);
        mScanButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, splitLine+"mScanButton");
                Intent i = ScanningActivity.newIntent(MainActivity.this);
                startActivityForResult(i, REQUEST_CODE_SN);
            }
        });

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_scan) {
            attemptToLaunchScanning();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void attemptToLaunchScanning() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            finishLaunchingScanning();
        } else {
            ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, REQUEST_CODE_CAMERA_PERMISSION);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CODE_CAMERA_PERMISSION:
                if (grantResults.length == 1 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    finishLaunchingScanning();
                }
                break;
            default:
                Log.e(TAG, "Unrecognized permission result");
        }
    }

    private void finishLaunchingScanning() {
        startActivity(new Intent(this, ScanningActivity.class));
    }

}
