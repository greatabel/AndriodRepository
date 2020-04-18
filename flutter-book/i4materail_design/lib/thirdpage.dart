import 'package:flutter/material.dart';

class ThirdPage extends StatefulWidget {


  // In the constructor, require a Person
//  ThirdPage({Key key, @required this.tabController}) : super(key: key);

  @override
  _ThirdPageState createState() => _ThirdPageState();

}

class _ThirdPageState extends State<ThirdPage> with SingleTickerProviderStateMixin{
  TabController _controller;

  @override
  void initState() {
    super.initState();
    _controller = new TabController(length: items.length, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text("第3页demo"),
        bottom: TabBar(
          unselectedLabelColor: Colors.white,
          labelColor: Colors.amber,
          isScrollable: true,
          tabs: items.map((ItemView item) {//迭代添加选项卡按钮子项
            //选项卡按钮由文本及图标组成
            return Tab(
              text: item.title,
              icon: Icon(item.icon),
            );
          }).toList(),
          controller: _controller,
          indicatorColor: Colors.white,
          indicatorSize: TabBarIndicatorSize.tab,),
        bottomOpacity: 1,
      ),
      body: TabBarView(
        //迭代显示选项卡视图
        children: items.map((ItemView item) {
          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: SelectedView(item: item),
          );
        }).toList(),
        controller: _controller,
      ),
    );
  }
}

//视图项数据
class ItemView {
  const ItemView({ this.title, this.icon });//构造方法 传入标题及图标
  final String title;//标题
  final IconData icon;//图标
}

//选项卡的类目
const List<ItemView> items = const <ItemView>[
  const ItemView(title: '自驾', icon: Icons.directions_car),
  const ItemView(title: '自行车', icon: Icons.directions_bike),
  const ItemView(title: '轮船', icon: Icons.directions_boat),
  const ItemView(title: '公交车', icon: Icons.directions_bus),
  const ItemView(title: '火车', icon: Icons.directions_railway),
  const ItemView(title: '步行', icon: Icons.directions_walk),
  const ItemView(title: '跑步', icon: Icons.directions_run),
];

//被选中的视图
class SelectedView extends StatelessWidget {
  const SelectedView({ Key key, this.item }) : super(key: key);

  //视图数据
  final ItemView item;

  @override
  Widget build(BuildContext context) {
    //获取文本主题样式
    final TextStyle textStyle = Theme.of(context).textTheme.display1;
    //添加卡片组件 展示有质感
    return Card(
      //卡片颜色
      color: Colors.white,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,//垂直方向最小化处理
          crossAxisAlignment: CrossAxisAlignment.center,//水平方向居中对齐
          children: <Widget>[
            Icon(item.icon, size: 128.0, color: textStyle.color),
            Text(item.title, style: textStyle),
          ],
        ),
      ),
    );
  }
}
