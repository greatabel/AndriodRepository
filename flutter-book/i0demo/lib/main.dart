import 'package:flutter/material.dart';
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  final appName = '自定义主题demo';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: appName,
      home: new MyHomePage(title: appName),
      theme: new ThemeData(
        brightness: Brightness.light,
        primaryColor: Colors.green[800],
        accentColor: Colors.red[600],

      ),
    );
  }
}

class MyHomePage extends StatelessWidget {
  final String title;

  MyHomePage({Key key, @required this.title}): super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return new Scaffold(
      appBar: new AppBar(title: new Text(title)),
      body: new Center(
        child: new Container(
            color: Theme.of(context).accentColor,
            child: new Text('测试文本', style: Theme.of(context).textTheme.title),
          ),
        ),
      floatingActionButton: new Theme(
        data: Theme.of(context).copyWith(
          colorScheme:
          Theme.of(context).colorScheme.copyWith(secondary: Colors.cyan),
        ),
        child: new FloatingActionButton(onPressed: null, child: new Icon(Icons.computer)),
      ),
      );

  }
}