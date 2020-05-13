import 'package:flutter/material.dart';

class PositionPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _PositionPage();
  }



}

class _PositionPage extends State<PositionPage>{
  static var imageUrl = "https://img9.doubanio.com/view/photo/l/public/p1791729816.webp";
  var stack = new Stack(
    alignment: Alignment.topLeft,
    children: <Widget>[
    Image.network(imageUrl),
      Positioned(
          bottom: 50.0,
          right: 50.0,
          child: new Text(
              "test positon",
               style: TextStyle(
                  fontSize: 36.0,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'serif',
                  color: Colors.white,
                ),
          )),
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