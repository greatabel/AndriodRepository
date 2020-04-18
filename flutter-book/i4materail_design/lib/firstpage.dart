import 'package:flutter/material.dart';

class FirstPage extends StatefulWidget {


  // In the constructor, require a Person
//  FirstPage({Key key, @required this.tabController}) : super(key: key);

  @override
  _SecondPageState createState() => _SecondPageState();

}
enum ConferenceItem { AddMember, LockConference, ModifyLayout, TurnoffAll }

class _SecondPageState extends State<FirstPage> with SingleTickerProviderStateMixin{

  TabController _controller;
  final GlobalKey _menuKey = new GlobalKey();
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();
  @override
  void initState() {
    super.initState();
    _controller = new TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    //会控菜单项

    var card = SizedBox(
      //限定高度
      height: 250.0,
      //添加Card组件
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15.0),
        ),
        color: Colors.red,
        //垂直布局
        child: Column(
          children: <Widget>[
            ListTile(
              //标题
              title: Text(
                '深圳市南山区深南大道',style: TextStyle(fontWeight: FontWeight.w300),
              ),
              //子标题
              subtitle: Text('XX有限公司'),
              //左侧图标
              leading: Icon(
                Icons.home,
                color: Colors.lightBlue,
              ),
            ),
            //分隔线
            Divider(),
            ListTile(
              title: Text(
                '深圳市罗湖区沿海大道',style: TextStyle(fontWeight: FontWeight.w300),
              ),
              subtitle: Text('XX培训机构'),
              leading: Icon(
                Icons.school,
                color: Colors.lightBlue,
              ),
            ),
            Divider(),
          ],
        ),
      ),
    );
    final button = new PopupMenuButton(
        key: _menuKey,
        itemBuilder: (_) => <PopupMenuItem<ConferenceItem>>[
          const PopupMenuItem<ConferenceItem>(//菜单项
            value: ConferenceItem.AddMember,
            child: Text('添加成员'),
          ),
          const PopupMenuItem<ConferenceItem>(
            value: ConferenceItem.LockConference,
            child: Text('锁定会议'),
          ),
          const PopupMenuItem<ConferenceItem>(
            value: ConferenceItem.ModifyLayout,
            child: Text('修改布局'),
          ),
          const PopupMenuItem<ConferenceItem>(
            value: ConferenceItem.TurnoffAll,
            child: Text('挂断所有'),
          ),
        ],
        onSelected: (_) {});

    return new Scaffold(
      key: _scaffoldKey,
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
          Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  new ListTile(title: new Text('PopupMenuButton组件示例'),
                                trailing: button, onTap: () {
                    // This is a hack because _PopupMenuButtonState is private.
                    dynamic state = _menuKey.currentState;
                    state.showButtonMenu();
                  }),
                  MyLayout(),
                  RaisedButton(
                    child: Text('snackbar'),
                    onPressed: (){
                      //点击回调事件 弹出一句提示语句
                      _scaffoldKey.currentState.showSnackBar(SnackBar(
                          duration: const Duration(seconds: 2),
                        //提示信息内容部分
                        content: Text("显示SnackBar"),
                      ));
                    },
                  ),
                ],
              )
          ),

          new Text("This is chat Tab View"),
          card
        ],
        controller: _controller,
      ),

    );
  }
}

class MyLayout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: RaisedButton(
        child: Text('Show alert'),
        onPressed: () {
          showAlertDialog(context);
        },
      ),
    );
  }
}

showAlertDialog(BuildContext context) {

  // set up the buttons
  Widget remindButton = FlatButton(
    child: Text("Remind me later"),
    onPressed:  () {},
  );
  Widget cancelButton = FlatButton(
    child: Text("Cancel"),
    onPressed:  () {Navigator.pop(context);},
  );
  Widget launchButton = FlatButton(
    child: Text("Launch missile"),
    onPressed:  () {},
  );

  // set up the AlertDialog
  AlertDialog alert = AlertDialog(
    title: Text("Notice"),
    content: Text("Launching this missile will destroy the entire universe. "
        "Is this what you intended to do?"),
    actions: [
      remindButton,
      cancelButton,
      launchButton,
    ],
  );

  // show the dialog
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return alert;
    },
  );
}