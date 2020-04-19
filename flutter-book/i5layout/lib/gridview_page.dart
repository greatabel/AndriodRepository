import 'package:flutter/material.dart';

class GridViewPage extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    // TODO: implement createState
    return _GridViewPage();
  }



}

class _GridViewPage extends State<GridViewPage>{


  @override
  Widget build(BuildContext context) {

    List<Container> _buildGridTitleList(int count) {
      //index为列表项索引
      return List<Container>.generate(count,(int index) => Container(
        //根据索引添加图片路径
        child: Image.asset('images/${index + 1}.jpeg'),
      ),
      );
    }
    
    Widget buildGrid() {
      return GridView.extent(
        maxCrossAxisExtent: 150.0,//次轴的宽度
        padding: const EdgeInsets.all(4.0),//上下左右内边距
        mainAxisSpacing: 4.0,//主轴元素间距
        crossAxisSpacing: 4.0,//次轴元素间距
        children: _buildGridTitleList(9),//添加9个元素
      );
    }

    return new Scaffold(
        appBar: AppBar(title: Text('Stack填充布局')),
        body: new Center(
          child: Container(
            decoration: BoxDecoration(
            gradient: RadialGradient(colors: [
            Colors.blue,
            Colors.red,
            ], radius: 0.85, focal: Alignment.center),
            ),
            child: buildGrid(),),
        ),
    );
  }
}