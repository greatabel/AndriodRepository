package com.luminagic.wanchang.a02mvc;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;


public class QuizActivity extends AppCompatActivity {

    // https://examples.javacodegeeks.com/core-java/util/arraylist/arraylist-in-java-example-how-to-use-arraylist/
    ArrayList<String> list = new ArrayList<String>();

    private static final String TAG = "QuizActivity";
    private static final String KEY_INDEX = "index";

    private static final int REQUEST_CODE_CHEAT = 0;

    private String splitLine = " <-@@@@@@@@@@@-> ";

    private Button mTrueButton;
    private Button mFalseButton;

    private Button mCheatButton;

    // 实验性质
    private Button mExportButton;

    private ImageButton mNextButton;
    private ImageButton mPrevButton;
    private TextView mQuestionTextView;

    private Question[] mQuestionBank = new Question[] {
            new Question(R.string.question_oceans, true),
            new Question(R.string.question_mideast, false),
            new Question(R.string.question_africa, false),
            new Question(R.string.question_americas, true),
            new Question(R.string.question_asia, true)
    };

    public void onClickTextView(View v) {
    // add click event for textview(question)

        mCurrentIndex = (mCurrentIndex + 1)% mQuestionBank.length;
        Log.d("onClickTextView:", Integer.toString(mCurrentIndex));
        updateQuestion();

    }

    private void checkAnswer(boolean userPressedTrue) {
        boolean answerIsTrue = mQuestionBank[mCurrentIndex].isAnswerTrue();
        int messageResId = 0;
        if(userPressedTrue == answerIsTrue) {
            messageResId = R.string.correct_toast;
        } else {
            messageResId = R.string.incorrect_toast;
        }

        if(mIsCheater){
            messageResId = R.string.judgement_toast;
        }

        Toast.makeText(this, messageResId, Toast.LENGTH_SHORT)
                .show();
    }

    private  int mCurrentIndex = 0;

    private boolean mIsCheater ;

    private  void updateQuestion() {
        int question = mQuestionBank[mCurrentIndex].getTextResId();
        mQuestionTextView.setText(question);
    }
//
//    public static FileWriter generateCsvFile(File sFileName,String fileContent) {
//        FileWriter writer = null;
//
//        try {
//            writer = new FileWriter(sFileName);
//            writer.append(fileContent);
//            writer.flush();
//
//        } catch (IOException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }finally
//        {
//            try {
//                writer.close();
//            } catch (IOException e) {
//                // TODO Auto-generated catch block
//                e.printStackTrace();
//            }
//        }
//        return writer;
//    }


    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        Log.i(TAG,"onSaveInstanceState");
        outState.putInt(KEY_INDEX, mCurrentIndex);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // only onCreate 's super.onCreate is important
        super.onCreate(savedInstanceState);

        Log.d(TAG,splitLine + "onCreate(Bundle) called");

        setContentView(R.layout.activity_quiz);

        mQuestionTextView = (TextView)findViewById(R.id.question_text_view);


        mTrueButton = (Button) findViewById(R.id.true_button);
        mFalseButton = (Button) findViewById(R.id.false_button);

        mTrueButton.setOnClickListener(new View.OnClickListener(){
         @Override
         public void onClick(View v){

             checkAnswer(true);
         }
        });
        mFalseButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){

                checkAnswer(false);
            }
        });

        mCheatButton = (Button)findViewById(R.id.cheat_button);
        mCheatButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                // Start CheatActivity
//                Intent i = new Intent(QuizActivity.this, CheatActivity.class);
                boolean answerIsTrue = mQuestionBank[mCurrentIndex].isAnswerTrue();
                Intent i = CheatActivity.newIntent(QuizActivity.this, answerIsTrue);
//                startActivity(i);
                startActivityForResult(i, REQUEST_CODE_CHEAT);
            }
        });

        mExportButton = (Button)findViewById(R.id.export_button);
        mExportButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG,"in mExportButton.setOnClickListener");
                String contentToSend = android.text.TextUtils.join(",", list);
                Intent sendIntent = new Intent();
                sendIntent.setAction(Intent.ACTION_SEND);
                sendIntent.putExtra(Intent.EXTRA_TEXT, contentToSend);
                sendIntent.setType("text/plain");
                startActivity(Intent.createChooser(sendIntent, "file_send"));



//                Date dateVal = new Date();
//
//                String filename = dateVal.toString();
//
//                File data = null;
//                try {
//                    data = File.createTempFile("Report", ".txt");
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }

//                FileWriter out = (FileWriter) generateCsvFile(
//                                        data, "Name,Data1");
//                Uri csv  =  Uri.fromFile(data);
//                Intent sharingIntent = new Intent(android.content.Intent.ACTION_SEND);
//                sharingIntent.setType("text/plain");
//                sharingIntent.setData(csv);
//                startActivity(Intent.createChooser(sharingIntent, "test"));


            }
        });



        mNextButton = (ImageButton)findViewById(R.id.next_button);
        mNextButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                mCurrentIndex = (mCurrentIndex + 1)% mQuestionBank.length;
                mIsCheater = false;
                updateQuestion();
            }
        });

        mPrevButton = (ImageButton)findViewById(R.id.prev_button);
        mPrevButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public  void onClick(View v){
                mCurrentIndex = (mCurrentIndex - 1)% mQuestionBank.length;
                if(mCurrentIndex < 0 && mCurrentIndex >= -4){
                    mCurrentIndex += mQuestionBank.length;
                }
                Log.d("mPrevButton", Integer.toString(mCurrentIndex));
                updateQuestion();
            }
        });

        if(savedInstanceState != null) {
            mCurrentIndex = savedInstanceState.getInt(KEY_INDEX, 0);
        }
        updateQuestion();

    }

    // add more life cycle method to study
    @Override
    public void onStart() {
        super.onStart();
        Log.d(TAG, splitLine+ "onStart() called");
    }

    @Override
    public void onPause() {
        super.onPause();
        Log.d(TAG, splitLine+"onPause() called");
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, splitLine+"onResume() called");
    }
    @Override
    public  void onStop(){
        super.onStop();
        Log.d(TAG, splitLine+"onStop() called");
    }
    @Override
    public  void onDestroy(){
        super.onDestroy();
        Log.d(TAG,splitLine+"onDestroy() called");
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d(TAG, "1 onActivityResult's requestCode: "+ Integer.toString(resultCode));

        if(resultCode != Activity.RESULT_OK) {
            return ;
        }
//        Log.d(TAG, "2 onActivityResult data: "+ data);
        if(requestCode == REQUEST_CODE_CHEAT){
            if(data == null){
                Log.d(TAG, "2.1 onActivityResult data: "+ data+"requestCode:"+
                        Integer.toString(requestCode));
                return;
            }
            mIsCheater = CheatActivity.wasAnswerShown(data);
            list.add(mCurrentIndex+" # "+mIsCheater);
            for(int i=0;i<50;i++){
                list.add("M0BGDB150049011LNUZWISQBe7db"+i);
            }

            for (String str : list) {

                Log.d(TAG,"Item is: " + str);

            }

//            Log.d(TAG, "3 onActivityResult mIsCheater: "+ Boolean.toString(mIsCheater));
        }
    }
}
