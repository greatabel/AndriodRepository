import 'package:flutter/material.dart';

class TablePage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _TablePage();
  }



}

class _TablePage extends State<TablePage>{


  @override
  Widget build(BuildContext context) {

    var table = Table(
      columnWidths: const <int, TableColumnWidth>{
        //指定索引及固定列宽
        0: FixedColumnWidth(100.0),
        1: FixedColumnWidth(40.0),
        2: FixedColumnWidth(80.0),
        3: FixedColumnWidth(80.0),
      },
      //设置表格边框样式
      border: TableBorder.all(color: Colors.black38, width: 2.0, style: BorderStyle.solid),
      children: const <TableRow>[
        //添加第一行数据
        TableRow(
          children: <Widget>[
            Text('姓名'),
            Text('性别'),
            Text('年龄'),
            Text('身高'),
          ],
        ),
        //添加第二行数据
        TableRow(
          children: <Widget>[
            Text('张三'),
            Text('男'),
            Text('26'),
            Text('172'),
          ],
        ),
        //添加第三行数据
        TableRow(
          children: <Widget>[
            Text('李四'),
            Text('男'),
            Text('28'),
            Text('178'),
          ],
        ),
      ],

    );

    return new Scaffold(
        appBar: AppBar(title: Text('Stack填充布局')),
        body: new Center(
          child: Container(
            decoration: BoxDecoration(
            gradient: RadialGradient(colors: [
            Colors.blue,
            Colors.red,
            ], radius: 0.85, focal: Alignment.center),
            ),
            child: table,
          ),
        ),
    );
  }
}