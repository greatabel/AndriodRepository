import 'package:flutter/material.dart';
import 'package:i4materail_design/drawer_demo.dart';

import 'firstpage.dart';
import 'thirdpage.dart';

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
        '/third':(BuildContext context) => ThirdPage(),
        '/drawer': (BuildContext context) => DrawerPage(),
      },
//      initialRoute: '/first',
      theme: new ThemeData(primarySwatch: Colors.cyan),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  int _selectedIndex = 1;

  final _widgetOptions = [
    Text('Index 0: 信息'),
    Text('Index 1: 通讯录'),
    Text('Index 2: 发现'),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        leading: Icon(Icons.home),
      actions: <Widget>[
        IconButton(icon: Icon(Icons.search), tooltip: 'search', onPressed: (){
        },),
        IconButton(icon: Icon(Icons.add), tooltip: 'add', onPressed: (){},),
      ],
          title: Text('AppBar例子')),
      body: Center(child: _widgetOptions.elementAt(_selectedIndex),
        //居中显示某一个文本
        ),
      bottomNavigationBar:BottomNavigationBar(

        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.chat), title: Text('信息')),
          BottomNavigationBarItem(icon: Icon(Icons.contacts), title: Text('通讯录')),
          BottomNavigationBarItem(icon: Icon(Icons.account_circle), title: Text('发现')),
        ],
        currentIndex: _selectedIndex,
        fixedColor: Colors.deepPurple,
        onTap: _onItemTapped,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed:  () {

          Navigator.pushNamed(context, '/second');
        },
        tooltip: '暂时测试跳转',
        child: Icon(Icons.airplanemode_active),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,

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
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              RaisedButton(
                child: Text('第1页tab/menu/dialog'),
                onPressed: (){
                  Navigator.pushNamed(context, '/first');
                },
              ),
              RaisedButton(
                child: Text('点我可以跳转到第3页tab'),
                onPressed: (){
                  Navigator.pushNamed(context, '/third');
                },
              ),
              RaisedButton(
                child: Text('点我可以跳转到抽屉Drawer'),
                onPressed: (){
                  Navigator.pushNamed(context, '/drawer');
                },
              ),
            ],
          )
        )
    );
  }
}