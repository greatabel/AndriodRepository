import 'package:flutter/material.dart';

class DrawerPage extends StatefulWidget {


  // In the constructor, require a Person
//  DrawerPage({Key key, @required this.tabController}) : super(key: key);

  @override
  _DrawerPageState createState() => _DrawerPageState();

}

class _DrawerPageState extends State<DrawerPage> with SingleTickerProviderStateMixin{
  TabController _controller;

  @override
  void initState() {
    super.initState();
    _controller = new TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(title: new Text("Drawer抽屉组件示例demo")),
      drawer: ListView(
        children: <Widget>[
          UserAccountsDrawerHeader(
            accountName: new Text(
              "greatabel",
            ),
            accountEmail: new Text(
              "myreceiver2for2github@gmail.com",
            ),
            //设置当前用户头像
            currentAccountPicture: new CircleAvatar(
              backgroundImage: new AssetImage("images/1.jpeg"),
            ),
            onDetailsPressed: () {},
            //属性本来是用来设置当前用户的其他账号的头像 这里用来当QQ二维码图片展示
            otherAccountsPictures: <Widget>[
              new Container(
                child: Image.asset('images/code.jpeg'),
              ),
            ],
          ),
          ListTile(
            leading: new CircleAvatar(child: Icon(Icons.color_lens)),//导航栏菜单
            title: Text('个性装扮'),
          ),
          ListTile(
            leading: new CircleAvatar(child: Icon(Icons.photo)),
            title: Text('我的相册'),
          ),
          ListTile(
            leading: new CircleAvatar(child: Icon(Icons.wifi)),
            title: Text('免流量特权'),
          ),
        ],
      ),
    );
  }
}