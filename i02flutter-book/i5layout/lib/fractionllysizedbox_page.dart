import 'package:flutter/material.dart';

class FractionllySizedBoxPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _FractionllySizedBoxPage();
  }



}

class _FractionllySizedBoxPage extends State<FractionllySizedBoxPage>{
  @override
  Widget build(BuildContext context) {
    var fractionlly = Container(
      color: Colors.blueGrey,
      height: 200.0,
      width: 200.0,
      child: FractionallySizedBox(
        alignment: Alignment.topLeft,//元素左上角对齐
        widthFactor: 0.5,//宽度因子
        heightFactor: 1.5,//高度因子
        child: Container(
          color: Colors.green,
        ),
      ),
    );

    return new Scaffold(
        appBar: AppBar(title: Text('FittedBox填充布局')),
        body: fractionlly,
    );
  }
}