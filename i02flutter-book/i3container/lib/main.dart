import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'container_demo.dart';
import 'image_widget.dart';
import 'text_demo.dart';
import 'list_demo.dart';
import 'longlistview.dart';
import 'loginform.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => Counter()),
      ],
      child: new MaterialApp(
        title: "第三方包示例",
        home: FirstPage(),
      ),
    );
  }


}

class FirstPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(title: new Text('第三方包示例')),
        body: new Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[

              new RaisedButton(
                onPressed: (){
                  Navigator.push(context,MaterialPageRoute(builder:(context){
                    return SecondPage();
                  }));
                },
                child: new Text('容器组件示例!'),
              ),

              new RaisedButton(
                onPressed: (){
                  Navigator.push(context,MaterialPageRoute(builder:(context){
                    return ImageDemo();
                  }));
                },
                child: new Text('图片demo'),
              ),
              new RaisedButton(
                  onPressed: (){
                Navigator.push(context,MaterialPageRoute(builder:(context){
                  return TextDemo();
                }));
              },
              child: new Text('文字demo'),
              ),
              new RaisedButton(
                onPressed: (){
                  Navigator.push(context,MaterialPageRoute(builder:(context){
                    return ListDemo();
                  }));
                },
                child: new Text('列表demo'),
              ),
              new RaisedButton(
                onPressed: (){
                  Navigator.push(context,MaterialPageRoute(builder:(context){
                    return LongListViewDemo();
                  }));
                },
                child: new Text('长列表demo'),
              ),
              new RaisedButton(
                onPressed: (){
                  Navigator.push(context,MaterialPageRoute(builder:(context){
                    return FormDeo();
                  }));
                },
                child: new Text('login表单demo'),
              ),],
          ),

        )
    );
  }

}


class Counter with ChangeNotifier {

  //存储数据
  int _count = 0;
  //提供外部能够访问的数据
  int get count => _count;

  //提供更改数据的方法
  void increment(){
    _count++;
    //通知所有听众进行刷新
    notifyListeners();
  }
}