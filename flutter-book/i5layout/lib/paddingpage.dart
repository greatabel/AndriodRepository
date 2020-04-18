import 'package:flutter/material.dart';

class PaddingPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _PaddingPage();
  }



}

class _PaddingPage extends State<PaddingPage>{
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: AppBar(title: Text('padding填充布局')),
        body: Center(
          //添加容器 外框
          child: Container(
            width: 400.0,
            height: 400.0,
            //容器内边距上下左右设置为60.0
            padding: EdgeInsets.all(30.0),
            //添加边框
            decoration: BoxDecoration(
              color: Colors.yellow,
              border: Border.all(
                color: Colors.red,
                width: 10.0,
              ),
            ),
            //添加容器 内框
            child: Container(
              width: 200.0,
              height: 200.0,
//              padding: EdgeInsets.all(50.0),
              //添加边框
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(
                  color: Colors.blue,
                  width: 5.0,
                ),
              ),
              //添加图标
              child: FlutterLogo(),
            ),
          ),
        )
    );
  }
}