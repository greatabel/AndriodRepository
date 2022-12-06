import 'package:flutter/material.dart';
import 'fooderlich_theme.dart';

void main() {
  // 1
  runApp(const Fooderlich());
}

class Fooderlich extends StatelessWidget {
  const Fooderlich({Key? key}) : super(key: key);
  // 2
  @override
  Widget build(BuildContext context) {

    final theme = FooderlichTheme.dark();

    // 3
    return MaterialApp(
      theme: theme,
      title: 'Fooderlich',
      // 4
      home: Scaffold(
        // 5
        appBar: AppBar(
            centerTitle: true,
            title:  Text('Fooderlich', style: theme.textTheme.headline6,)),
        body:  Center(child: Text('Let\'s get cooking 👩‍🍳',
        style: theme.textTheme.headline1,)),
      ),
    );
  }
}
