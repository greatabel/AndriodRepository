import 'package:flutter/material.dart';

class ImageDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('image组件示例'),
      ),
      body: Center(
        //添加容器
        child: new Image.network(
        'https://flutter.dev/assets/homepage/carousel/slide_1-bg-4e2fcef9a7343692a5f7784d68241a786c57c79d55f0fe37e6b82a653d146b93.jpg',
          fit: BoxFit.fitWidth,
        ),
      ),
    );
  }

}
