import 'package:flutter/material.dart';

class FirstPage extends StatefulWidget {


  // In the constructor, require a Person
//  FirstPage({Key key, @required this.tabController}) : super(key: key);

  @override
  _SecondPageState createState() => _SecondPageState();

}

class _SecondPageState extends State<FirstPage> with SingleTickerProviderStateMixin{
  TabController _controller;

  @override
  void initState() {
    super.initState();
    _controller = new TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text("第1页demo"),
        bottom: TabBar(
          unselectedLabelColor: Colors.white,
          labelColor: Colors.amber,
          tabs: [
            new Tab(icon: new Icon(Icons.call)),
            new Tab(
              icon: new Icon(Icons.chat),
            ),
            new Tab(
              icon: new Icon(Icons.notifications),
            )
          ],
          controller: _controller,
          indicatorColor: Colors.white,
          indicatorSize: TabBarIndicatorSize.tab,),
        bottomOpacity: 1,
      ),
      body: TabBarView(
        children: [
          new Text("This is call Tab View"),
          new Text("This is chat Tab View"),
          new Text("This is notification Tab View"),
        ],
        controller: _controller,
      ),
    );
  }
}