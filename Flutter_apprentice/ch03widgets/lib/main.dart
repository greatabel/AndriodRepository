import 'package:flutter/material.dart';
import 'fooderlich_theme.dart';
import 'home.dart';

void main() {
  // 1
  runApp(const Fooderlich());
}

class Fooderlich extends StatelessWidget {
  const Fooderlich({Key? key}) : super(key: key);
  // 2
  @override
  Widget build(BuildContext context) {

    // final theme = FooderlichTheme.dark();

    final theme = FooderlichTheme.light();

    // 3
    return MaterialApp(
      theme: theme,
      title: 'Fooderlich',
      // 4
      home: const Home(),
    );
  }
}
