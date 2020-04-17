import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context){
    return new MaterialApp(
      home: new MyHomePage(),
      title: 'MaterialApp例子',
      routes: {
        '/first': (BuildContext context) => FirstPage(),
        '/second': (BuildContext context) => SecondPage(),
      },
      initialRoute: '/first',
      theme: new ThemeData(primarySwatch: Colors.red),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(title: Text('例子')),
      body: Center(child: Text('Scaffold脚手架')),
      bottomNavigationBar: BottomAppBar(
        child: Container(height: 50.0,),

      ),
      floatingActionButton: FloatingActionButton(
        onPressed:  () {},
        tooltip: '增加',
        child: Icon(Icons.add),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );

  }
}

class FirstPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(title: Text('这是第1页')),
      body: Center(
        child: RaisedButton(
          child: Text('这是第1页内容，点我可以跳转'),
          onPressed: (){
            Navigator.pushNamed(context, '/second');
          },
        ),
      )
    );
  }
}

class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
        appBar: AppBar(title: Text('这是第2页')),
        body: Center(
          child: RaisedButton(
            child: Text('这是第2页内容, 点我可以跳转'),
            onPressed: (){
              Navigator.pushNamed(context, '/first');
            },
          ),
        )
    );
  }
}