import 'package:flutter/material.dart';
import 'package:i5layout/align_page.dart';
import 'package:i5layout/aspect_radio_page.dart';
import 'package:i5layout/fittedbox_page.dart';
import 'package:i5layout/overflowbox_page.dart';
import 'package:i5layout/paddingpage.dart';
import 'package:i5layout/positon_page.dart';
import 'package:i5layout/stack_page.dart';
import 'package:i5layout/fractionllysizedbox_page.dart';

void main() => runApp(
  MaterialApp(
    title: 'Container容器布局示例',
    home: LayoutDemo(),
    routes: {
      '/padding': (BuildContext context) => PaddingPage(),
      '/align': (BuildContext context) => AlignPage(),
      '/fittedbox': (BuildContext context) => FittedBoxPage(),
      '/stack': (BuildContext context) => StackPage(),
      '/position': (BuildContext context) => PositionPage(),
      '/overflowbox': (BuildContext context) => OverflowBoxPage(),
      '/aspectradio': (BuildContext context) => AspectRadioPage(),
      '/fractionallysizedbox':(BuildContext context) => FractionllySizedBoxPage(),
    },
  ),
);

class LayoutDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    //返回一个Container对象
    Widget container = Container(
      //添加装饰效果
      decoration: BoxDecoration(
        //背景色
        color: Colors.grey,
      ),
      //子元素指定为一个垂直水平嵌套布局的组件
      child: Column(
        children: <Widget>[
          //水平布局
          Row(
            children: <Widget>[
              //使用Expanded防止内容溢出
              Expanded(
                child: Container(
                  width: 150.0,
                  height: 150.0,
                  //添加边框样式
                  decoration: BoxDecoration(
                    //上下左右边框设置为宽度10.0 颜色为蓝灰色
                    border: Border.all(width: 10.0, color: Colors.blueGrey),
                    //上下左右边框弧度设置为8.0
                    borderRadius: const BorderRadius.all(const Radius.circular(8.0)),
                  ),
                  //上下左右增加边距
                  margin: const EdgeInsets.all(4.0),
                  //添加图片
                  child: Image.asset('images/1.jpeg'),
                ),
              ),
              Expanded(
                child: Container(
                  width: 150.0,
                  height: 150.0,
                  decoration: BoxDecoration(
                    border: Border.all(width: 10.0, color: Colors.blueGrey),
                    borderRadius: const BorderRadius.all(const Radius.circular(8.0)),
                  ),
                  margin: const EdgeInsets.all(4.0),
                  child: Image.asset('images/2.jpeg'),
                ),
              ),
            ],
          ),
          Row(
            children: <Widget>[
              Expanded(
                child: Container(
                  width: 150.0,
                  height: 150.0,
                  decoration: BoxDecoration(
                    border: Border.all(width: 10.0, color: Colors.blueGrey),
                    borderRadius: const BorderRadius.all(const Radius.circular(8.0)),
                  ),
                  margin: const EdgeInsets.all(4.0),
                  child: Image.asset('images/3.jpeg'),
                ),
              ),
              Expanded(
                child: Container(
                  width: 150.0,
                  height: 150.0,
                  decoration: BoxDecoration(
                    border: Border.all(width: 10.0, color: Colors.blueGrey),
                    borderRadius: const BorderRadius.all(const Radius.circular(8.0)),
                  ),
                  margin: const EdgeInsets.all(4.0),
                  child: Image.asset('images/2.jpeg'),
                ),
              ),
            ],
          ),
          Row(children: <Widget>[
            RaisedButton(
              child: Text('padding'),
              onPressed: (){
                Navigator.pushNamed(context, '/padding');
              },
            ),
            RaisedButton(
              child: Text('align'),
              onPressed: (){
                Navigator.pushNamed(context, '/align');
              },
            ),
            RaisedButton(
              child: Text('fittedbox'),
              onPressed: (){
                Navigator.pushNamed(context, '/fittedbox');
              },
            ),
            RaisedButton(
              child: Text('stack'),
              onPressed: (){
                Navigator.pushNamed(context, '/stack');
              },
            ),

          ],),
          Row(children: <Widget>[
            RaisedButton(
              child: Text('positon'),
              onPressed: (){
                Navigator.pushNamed(context, '/position');
              },
            ),
            RaisedButton(
              child: Text('overflowbox'),
              onPressed: (){
                Navigator.pushNamed(context, '/overflowbox');
              },
            ),
            RaisedButton(
              child: Text('aspectradio'),
              onPressed: (){
                Navigator.pushNamed(context, '/aspectradio');
              },
            ), RaisedButton(
              child: Text('aspectradio'),
              onPressed: (){
                Navigator.pushNamed(context, '/fractionallysizedbox');
              },
            ),
          ],),
        ],
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: Text('Container容器布局示例'),
      ),
      body: container,
      floatingActionButton: FloatingActionButton(
        onPressed:  () {

//          Navigator.pushNamed(context, '/padding');
        },
        tooltip: '暂时测试跳转',
        child: Icon(Icons.airplanemode_active),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}