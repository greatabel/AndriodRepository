import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return new MaterialApp(
      title: "第三方包示例",
      home: new Scaffold(
        appBar: new AppBar(title: new Text('第三方包示例')),
        body: new Center(
          child: new RaisedButton(
            onPressed: (){
              const url = "https://m.douban.com";
              launch(url);
            },
            child: new Text('打开douban'),
          ),

        )
      ),
    );
  }
}