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

    var wrapW = Wrap(
      spacing: 8.0, // Chip之间的间距大小
      runSpacing: 4.0, // 行之间的间距大小
      children: <Widget>[
        Chip(
          //添加圆形头像
          avatar: CircleAvatar(
              backgroundColor: Colors.lightGreen.shade800, child: Text('西门', style: TextStyle(fontSize: 10.0),)),
          label: Text('西门吹雪'),
        ),
        Chip(
          avatar: CircleAvatar(
              backgroundColor: Colors.lightBlue.shade700, child: Text('司空', style: TextStyle(fontSize: 10.0),)),
          label: Text('司空摘星'),
        ),
        Chip(
          avatar: CircleAvatar(
              backgroundColor: Colors.orange.shade800, child: Text('婉清', style: TextStyle(fontSize: 10.0),)),
          label: Text('木婉清'),
        ),
        Chip(
          avatar: CircleAvatar(
              backgroundColor: Colors.blue.shade900, child: Text('一郎', style: TextStyle(fontSize: 10.0),)),
          label: Text('萧十一郎'),
        ),
      ],
    );
    return new Scaffold(
        appBar: AppBar(title: Text('Stack填充布局')),
        body:  Container(
            width: MediaQuery.of(context).size.width,
            decoration: BoxDecoration(
            gradient: RadialGradient(colors: [
            Colors.blue,
            Colors.pink,
            ], radius: 0.95, focal: Alignment.center),
            ),
            child: Column(
              children: <Widget>[offstageW,wrapW],
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