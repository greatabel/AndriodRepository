import 'package:flutter/material.dart';

class OffStagePage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _OffStagePage();
  }

}

class _OffStagePage extends State<OffStagePage>{

  bool offstage = true;

  @override
  Widget build(BuildContext context) {

    var offstageW = Offstage(
      offstage: offstage,//控制是否显示
      child: Text(
        '我出来啦！',
        style: TextStyle(
          fontSize: 36.0,
        ),
      ),
    );

    return new Scaffold(
        appBar: AppBar(title: Text('Stack填充布局')),
        body: new Center(
          child: Container(
            decoration: BoxDecoration(
            gradient: RadialGradient(colors: [
            Colors.grey,
            Colors.pink,
            ], radius: 0.85, focal: Alignment.center),
            ),
            child: offstageW,
          ),
        ),
      floatingActionButton: FloatingActionButton(
        onPressed: (){
          //设置是否显示文本组件
          setState(() {
            offstage = !offstage;
          });
        },
        tooltip: "显示隐藏",
        child: Icon(Icons.flip),
      ),
    );
  }
}