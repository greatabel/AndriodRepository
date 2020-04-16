import 'package:flutter/material.dart';

class LongListViewDemo extends StatelessWidget {


  @override
  Widget build(BuildContext context) {
    final List<String> items = new List<String>.generate(500, (i) => "Item $i");
    return Scaffold(
      appBar: AppBar(
        title: Text('Text组件示例'),
      ),
      body: ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) {
          return ListTile(
            leading: Icon(Icons.phone),
            title: Text("${items[index]}"),
          );
        },
      )
    );
  }

}
