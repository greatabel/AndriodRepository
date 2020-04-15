import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return new MaterialApp(
      title: "第三方包示例",
      home: new Scaffold(
        appBar: new AppBar(title: new Text('第三方包示例')),
        body: new Center(
          child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              new RaisedButton(
              onPressed: (){
                const url = "https://m.douban.com";
                launch(url);
              },
              child: new Text('打开douban'),
              ),
              new RaisedButton(
                onPressed: (){
                  const url = "http://httpbin.org/";
                  http.get(url).then((response) {
                    print("状态: ${response.statusCode}");

                  });
                },
                child: new Text('http请求按钮'),
              ),],
          ),

        )
      ),
    );
  }
}