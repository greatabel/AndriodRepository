import 'package:flutter/material.dart';

class TextDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Text组件示例'),
      ),
      body: Column(
        //添加容器
        children: <Widget>[
        //文本组件
        Text(
        '红色字体+黑色删除线+18号+斜体+粗体',
        //文本样式
        style: TextStyle(
          //字体颜色
          color: const Color(0xffff0000),
          //文本装饰器(删除线)
          decoration: TextDecoration.lineThrough,
          //文本装饰器颜色(删除线颜色)
          decorationColor: const Color(0xff000000),
          //字体大小
          fontSize: 18.0,
          //字体样式 是否斜体
          fontStyle: FontStyle.italic,
          //字体粗细
          fontWeight: FontWeight.bold,
          //文字间距
          letterSpacing: 2.0,
        ),
      ),
      Text(
        '橙色+下划线+24号',
        style: TextStyle(
          color: const Color(0xffff9900),
          decoration: TextDecoration.underline,
          fontSize: 24.0,
        ),
      ),
      Text(
        '上划线+虚线+23号',
        style: TextStyle(
          decoration: TextDecoration.overline,
          decorationStyle: TextDecorationStyle.dashed,
          fontSize: 23.0,
          //字体样式
          fontStyle: FontStyle.normal,
        ),
      ),
      Text(
        '23号+斜体+加粗+字间距6',
        style: TextStyle(
          fontSize: 23.0,
          fontStyle: FontStyle.italic,
          fontWeight: FontWeight.bold,
          letterSpacing: 6.0,
        ),
      ),
      IconButton(
        //图标元素
        icon: Icon(Icons.volume_up,size: 48.0,),
        //按钮提示
        tooltip: '按下操作',
        //按下事件响应
        onPressed:(){
          print('按下操作');
        },
      ),
      ],
      ),
    );
  }

}
