import 'package:flutter/material.dart';

class FittedBoxPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _FittedBoxPage();
  }



}

class _FittedBoxPage extends State<FittedBoxPage>{
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: AppBar(title: Text('FittedBox填充布局')),
        body: Container(
          color: Colors.cyan,
          width: 250.0,
          height: 250.0,
          child: FittedBox(
            fit: BoxFit.contain,
            alignment: Alignment.topLeft,
            child: Container(
              color: Colors.deepPurple,
              child: Text("缩放布局"),
            ),
          ),
        ),
    );
  }
}