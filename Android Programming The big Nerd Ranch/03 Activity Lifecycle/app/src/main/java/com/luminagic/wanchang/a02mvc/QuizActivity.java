package com.luminagic.wanchang.a02mvc;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

public class QuizActivity extends AppCompatActivity {

    private static final String TAG = "QuizActivity";
    private String splitLine = " <-@@@@@@@@@@@-> ";

    private Button mTrueButton;
    private Button mFalseButton;

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
        Toast.makeText(this, messageResId, Toast.LENGTH_SHORT)
                .show();
    }

    private  int mCurrentIndex = 0;

    private  void updateQuestion() {
        int question = mQuestionBank[mCurrentIndex].getTextResId();
        mQuestionTextView.setText(question);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
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

        mNextButton = (ImageButton)findViewById(R.id.next_button);
        mNextButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                mCurrentIndex = (mCurrentIndex + 1)% mQuestionBank.length;
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

}
