import 'package:flutter/material.dart';

class OverflowBoxPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _OverflowBoxPage();
  }



}

class _OverflowBoxPage extends State<OverflowBoxPage>{
  @override
  Widget build(BuildContext context) {
    var overflowbox = Container(
      color: Colors.green,
      width: 200.0,
      height: 200.0,
      padding: const EdgeInsets.all(50.0),
      child: OverflowBox(
        alignment: Alignment.topLeft,
        maxWidth: 400.0,
        maxHeight: 400.0,
        child: Container(
          color: Colors.blueGrey,
          width: 300.0,
          height: 300.0,
        ),
      ),
    );
    return new Scaffold(
        appBar: AppBar(title: Text('overflow填充布局')),
        body: Container(
          color: Colors.cyan,
          width: 250.0,
          height: 250.0,
          child: overflowbox,
        ),
    );
  }
}