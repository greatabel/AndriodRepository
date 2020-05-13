import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

import 'dart:convert';
import 'dart:io';

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
                  Navigator.push(context,MaterialPageRoute(builder:(context){
                    return SecondPage();
                  }));
                },
                child: new Text('第2页!'),
              ),
              new RaisedButton(
                onPressed: (){
                  Navigator.push(context,MaterialPageRoute(builder:(context){
                    return ThirdPage();
                  }));
                },
                child: new Text('第3页!'),
              ),
              new RaisedButton(
                onPressed: (){
                  getWeatherData();
                },
                child: new Text('获取天气'),
              ),],
          ),

        )
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

class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(title: Text("second page")),
      body: Center(
        //获取计数器中的count值
        child: Text("${Provider.of<Counter>(context).count}"),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: (){
          print('###');
          //调用数据模型中的increment方法更改数据
          Provider.of<Counter>(context, listen: false).increment();
        },
        child: Icon(Icons.add),
      ),
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

class ThirdPage extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(title: Text("3 page")),
      body: Center(
        //获取计数器中的count值
        child: Text("${Provider.of<Counter>(context).count}"),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: (){
          process();
          print(getUserInfo('小王', '男'));
        },
        child: Icon(Icons.add),
      ),
    );
  }

  void process(){
    var week = new Map();
    week['Monday'] = '星期一';
    week['Tuesday'] = '星期二';
    week['Wednesday'] = '星期三';
    week['Thursday'] = '星期四';
    week['Friday'] = '星期五';
    week['Saturday'] = '星期六';
    week['Sunday'] = '星期日';
    week['0'] = '星期一';

    //assert(week['Monday'] == null);

    print(week.length);
    print(week['Sunday']);
  }

  String getUserInfo(String name, String sex, [String from = '中国']) {
    var info = '$name的性别是$sex';
    if (from != null) {
      info = '$info来自$from';
    }
    return info;
  }

}