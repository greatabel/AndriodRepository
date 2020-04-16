import 'package:flutter/material.dart';

class ListDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Text组件示例'),
      ),
      body: new ListView(
        children: <Widget>[
          ListTile(leading: Icon(Icons.alarm), title: Text("alarm")),
          ListTile(leading: Icon(Icons.phone), title: Text("phone")),
          ListTile(leading: Icon(Icons.airplay), title: Text("airplay")),
        ],
      )
    );
  }

}
