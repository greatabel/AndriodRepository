import 'package:flutter/material.dart';

class AspectRadioPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _AspectRadioPage();
  }



}

class _AspectRadioPage extends State<AspectRadioPage>{
  @override
  Widget build(BuildContext context) {
    var aspect_radio = Container(
      color: Colors.green,
      height: 100.0,
      padding: const EdgeInsets.all(10.0),
      child: AspectRatio(
        aspectRatio: 2.5,
        child: Container(
          color: Colors.red,
        )
      )
    );

    return new Scaffold(
        appBar: AppBar(title: Text('FittedBox填充布局')),
        body: aspect_radio,
    );
  }
}