import 'package:flutter/material.dart';

class ListDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Text组件示例'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(child:new ListView(
            children: <Widget>[
              ListTile(leading: Icon(Icons.alarm), title: Text("alarm")),
              ListTile(leading: Icon(Icons.phone), title: Text("phone")),
              ListTile(leading: Icon(Icons.airplay), title: Text("airplay")),
            ],
          )),
          Expanded(child:Container(
            //顶部外边距为20
            margin: EdgeInsets.symmetric(vertical: 20.0),
            //设定容器高度
            height: 200.0,
            child: ListView(
              //设置水平方向排列
              scrollDirection: Axis.horizontal,
              //添加子元素
              children: <Widget>[
                //每个Container即为一个列表项
                Container(
                  width: 160.0,
                  color: Colors.lightBlue,
                ),
                Container(
                  width: 160.0,
                  color: Colors.amber,
                ),
                //此容器里"水平"及"列表"文字为垂直布局
                Container(
                  width: 160.0,
                  color: Colors.green,
                  //垂直布局
                  child: Column(
                    children: <Widget>[
                      Text(
                        '水平',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 36.0,
                        ),
                      ),
                      Text(
                        '列表',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 36.0,
                        ),
                      ),
                      Icon(Icons.list),
                    ],
                  ),
                ),
                Container(
                  width: 160.0,
                  color: Colors.deepPurpleAccent,
                ),
                Container(
                  width: 160.0,
                  color: Colors.black,
                ),
                Container(
                  width: 160.0,
                  color: Colors.pinkAccent,
                ),
              ],
            ),
          ),),
          Expanded(child:new GridView.count(
            primary: false,
            padding: const EdgeInsets.all(20.0),
            crossAxisSpacing: 30.0,
            crossAxisCount: 3,
            children: <Widget>[
              const Text('第一行第一列'),
              const Text('第一行第二列'),
              const Text('第一行第三列'),
              const Text('第二行第一列'),
              const Text('第二行第二列'),
              const Text('第二行第三列'),
              const Text('第三行第一列'),
              const Text('第三行第二列'),
              const Text('第三行第三列'),
              const Text('第四行第一列'),
              const Text('第四行第二列'),
              const Text('第四行第三列'),
              const Text('第五行第一列'),
              const Text('第五行第二列'),
              const Text('第五行第三列'),
            ]
          )),
        ]
      )
    );
  }

}
