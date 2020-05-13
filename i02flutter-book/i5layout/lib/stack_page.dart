import 'package:flutter/material.dart';

class StackPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _StackPage();
  }



}

class _StackPage extends State<StackPage>{

  var stack = new Stack(
    alignment: Alignment.topLeft,
    children: <Widget>[
      new CircleAvatar(
        backgroundImage: new AssetImage('images/1.jpeg'),
        radius: 100.0,
      ),
      new Container(
        decoration: new BoxDecoration(color: Colors.yellow),
        child: new Text('超级飞侠'),
      )
    ],
  );
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: AppBar(title: Text('Stack填充布局')),
        body: new Center(
          child: stack,
        ),
    );
  }
}