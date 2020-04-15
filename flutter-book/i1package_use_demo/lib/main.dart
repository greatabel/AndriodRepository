import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:http/http.dart' as http;

import 'dart:convert';
import 'dart:io';

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
              ),
              new RaisedButton(
                onPressed: (){
                  getWeatherData();
                },
                child: new Text('获取天气'),
              ),],
          ),

        )
      ),
    );
  }

  void getWeatherData() async {
    try {
      HttpClient httpClient = new HttpClient();

      HttpClientRequest request = await httpClient.getUrl(
        Uri.parse("http://t.weather.sojson.com/api/weather/city/101030100")
      );

      HttpClientResponse response = await request.close();

      var result = await response.transform(utf8.decoder).join();
      print(result);

      httpClient.close();

    } catch (e) {
      print("请求失败: $e");
    } finally {

    }
  }
}