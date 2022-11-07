import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';

class RandomWords extends StatefulWidget {
  const RandomWords({super.key});

  @override
  State<RandomWords> createState() => _RandomWordsState();
}

// class _RandomWordsState extends State<RandomWords> {
//   @override
//   Widget build(BuildContext context) {
//     final wordPair = WordPair.random();
//     return Text(wordPair.asPascalCase);
//   }
// }
class _RandomWordsState extends State<RandomWords> {
  final _suggestions = <WordPair>[];
  final _biggerFont = const TextStyle(fontSize: 18);
  // #enddocregion RWS-var

  // #docregion RWS-build
  @override
  Widget build(BuildContext context) {
    // #docregion itemBuilder
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemBuilder: /*1*/ (context, i) {
        if (i.isOdd) return const Divider(); /*2*/

        final index = i ~/ 2; /*3*/
        if (index >= _suggestions.length) {
          _suggestions.addAll(generateWordPairs().take(10)); /*4*/
        }
        // #docregion listTile
        return ListTile(
          title: Text(
            _suggestions[index].asPascalCase,
            style: _biggerFont,
          ),
        );
        // #enddocregion listTile
      },
    );
    // #enddocregion itemBuilder
  }
// #enddocregion RWS-build
// #docregion RWS-var
}
// #enddocregion RWS-var

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // final wordPair = WordPair.random();
    return MaterialApp(
      title: 'Startup Name Generator',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Startup Name Generator I'),
        ),
        body: const Center(
          // child: Text(wordPair.asPascalCase),
          child: RandomWords(),
        ),
      ),
    );
  }
}